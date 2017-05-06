import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import PlayerPreview from './PlayerPreview'

class PlayerInput extends React.Component {
  state = {
    username: ''
  }

  handleChange = (event) => {
    const value = event.target.value
    this.setState({
      username: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    this.props.onSubmit(this.props.id, this.state.username)
  }

  render () {
    return (
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='username'>
          {this.props.label}
        </label>
        <input
          id='username'
          placeholder='github username'
          type='text'
          autoComplete='off'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!this.state.username}>
          Submit
        </button>

      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

class Battle extends React.Component {
  state = {
    playerOneName: '',
    playerTwoName: '',
    playerOneImage: null,
    playerTwoImage: null
  }

  handleSubmit = (id, username) => {
    this.setState(() => {
      const newState = {}
      newState[`${id}Name`] = username
      newState[`${id}Image`] = `https://github.com/${username}.png?size=200`
      return newState
    })
  }

  handleReset = (id) => {
    this.setState(() => {
      const newState = {}
      newState[`${id}Name`] = ''
      newState[`${id}Image`] = null
      return newState
    })
  }

  battleNotReady () {
    return !(this.state.playerOneImage && this.state.playerTwoImage)
  }

  renderBattleButton () {
    if (this.battleNotReady()) { return null }

    const match = this.props.match
    const query = queryString.stringify({
      playerOneName: this.state.playerOneName,
      playerTwoName: this.state.playerTwoName
    })

    const resultsPath = {
      pathname: `${match.url}/results`,
      search: `?${query}`
    }

    return (
      <Link className='button' to={resultsPath}>Battle!</Link>
    )
  }

  // id should be 'One' or 'Two'
  renderPlayer (id) {
    const playerId = `player${id}`
    const playerLabel = `Player ${id}`
    const playerName = this.state[`${playerId}Name`]
    const playerImage = this.state[`${playerId}Image`]

    if (!playerName) {
      return (
        <PlayerInput
          id={playerId}
          label={playerLabel}
          onSubmit={this.handleSubmit}
        />
      )
    }

    return (
      <PlayerPreview avatar={playerImage} username={playerName}>
        <button className='reset' onClick={this.handleReset.bind(null, playerId)}>
          Reset
        </button>
      </PlayerPreview>
    )
  }

  render () {
    return (
      <div>
        <div className='row'>
          {this.renderPlayer('One')}
          {this.renderPlayer('Two')}
        </div>
        {this.renderBattleButton()}
      </div>
    )
  }
}

export default Battle
