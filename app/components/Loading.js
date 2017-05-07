import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  content: {
    textAlign: 'center',
    fontSize: '35px'
  }
}

class Loading extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      text: props.text
    }
  }

  componentDidMount () {
    const stopper = `${this.props.text}...`
    this.interval = window.setInterval(() => {
      this.setState(prevState => {
        let newText

        if (prevState.text === stopper) {
          newText = this.props.text
        } else {
          newText = `${prevState.text}.`
        }

        return { text: newText }
      })
    }, this.props.speed)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    return (
      <p style={styles.content}>
        {this.state.text}
      </p>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired
}

Loading.defaultProps = {
  text: 'Loading',
  speed: 300
}

export default Loading
