import axios from 'axios'

/*
 * Authentication options for Github API:
 * ======================================
 *
 *  const GITHUB_CLIENT_ID = ''
 *  const GITHUB_CLIENT_SECRET = ''
 *  const GITHUB_AUTH_PARAMS = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`
 */

function getProfile (username) {
  return axios.get(`https://api.github.com/users/${username}`).then(user => user.data)
}

function getRepos (username) {
  return axios.get(`https://api.github.com/users/${username}/repos?per_page=100`)
}

function getStarCount (repos) {
  return repos.data.reduce((count, repo) => {
    return count + repo.stargazers_count
  }, 0)
}

function calculateScore (profile, repos) {
  const followers = profile.followers
  const totalStars = getStarCount(repos)

  return (followers * 3) + totalStars
}

function handleError (error) {
  console.warn(error)
  return null
}

function getUserData (player) {
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then((data) => {
    const profile = data[0]
    const repos = data[1]

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  })
}

function sortPlayers (players) {
  return players.sort((a, b) => (b.score - a.score))
}

function battle (players) {
  return axios
    .all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError)
}

function fetchPopularRepositories (language) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  )

  return axios.get(encodedURI).then(response => response.data.items)
}

export default {
  fetchPopularRepositories,
  battle
}
