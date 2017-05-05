import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepositories } from '../utils/api'

const SelectLanguage = (props) => {
  const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='languages'>
      {languages.map((lang) => {
        return (
          <li
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, lang)}
            key={lang}>
            {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const Repo = (props) => {
  const repo = props.repo
  return (
    <li className='popular-item'>
      <div className='popular-rank'>#{props.rank}</div>
      <ul className='space-list-item'>
        <li>
          <img
            className='avatar'
            src={repo.owner.avatar_url}
            alt={`Avatar for ${repo.owner.login}`}
          />
        </li>
        <li>
          <a href={repo.html_url}>{repo.name}</a>
        </li>
        <li>@{repo.owner.login}</li>
        <li>{repo.stargazers_count} stars</li>
      </ul>
    </li>
  )
}

const RepoGrid = (props) => {
  const repos = props.repos.map((repo, index) => (
    <Repo key={repo.id} repo={repo} rank={index + 1} />
  ))

  return (
    <ul className='popular-list'>
      {repos}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: null
  }

  updateLanguage = (lang) => {
    this.setState({
      selectedLanguage: lang,
      repos: null
    })

    fetchPopularRepositories(lang).then((repos) => {
      this.setState({
        repos: repos
      })
    }
    )
  }

  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage)
  }

  render () {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!this.state.repos
            ? <p>LOADING...</p>
            : <RepoGrid repos={this.state.repos} />
        }
      </div>
    )
  }
}

export default Popular
