import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants'
import { graphql, gql } from 'react-apollo'
import './Login.css'

class Login extends Component {

  state = {
    errorText: '',
  }

  render() {
    return (
      <div className="LoginCard">
        <form
          onSubmit={(ev) => {
            ev.preventDefault()
            const {username: email, password} = ev.target.elements
            this._loginUser({ email: email.value, password: password.value })
          }}
          className="LoginInput"
        >
          Login
          <input
            name="username"
            type='text'
            placeholder='Your email address'
            autoComplete="email"
          />
          <input
            name="password"
            type='password'
            placeholder='Your password'
            autoComplete="password"
          />
          <button type="submit"> Login </button>
        </form>
        {this.state.errorText ?
          <div className="LoginError">
            {this.state.errorText}
          </div>
          : ''
        }
      </div>
    )
  }

  async _loginUser({email, password}) {
    try {
      const result = await this.props.signinUserMutation({
        variables: {
          email,
          password
        }
      })
      this.setState({ errorText: '' })
      const id = result.data.signinUser.user.id
      const token = result.data.signinUser.token
      this._saveUserData(id, token)
      this.props.history.push(`/`)
    }
    catch (err) {
      window.err = err;
      this.setState({ errorText: err.message })
    }
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }
}


const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`

export default graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })(Login)
