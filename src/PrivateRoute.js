import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'
import { Route, Redirect } from 'react-router-dom'

class PrivateRoute extends Component {
  render() {
    if (this.props.data && this.props.data.loading) {
      return (<div className="Loading">Loading...</div>)
    }
    const { component: Component, ...rest } = this.props
    return (
      <Route {...rest} render={props => (
       this._isLoggedIn() ? (
         <Component {...props}/>
       ) : (
         <Redirect to={{
           pathname: '/login',
           state: { from: props.location }
         }}/>
       )
     )}/>
    )
  }

  _isLoggedIn() {
    return this.props.data.user
  }
}

const userQuery = gql`
  query {
    user {
      id
      name
    }
  }
`

export default graphql(userQuery, { options: {fetchPolicy: 'network-only' }})(PrivateRoute)
