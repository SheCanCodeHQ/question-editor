import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import './Header.css';
import { client } from './index'

class Header extends Component {

  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div className="Header">
        <div className="Title">Question Editor</div>
        {userId ?
          <div className="Navigation">
            <NavLink exact to="/" activeClassName="selected" className="NavLink">Questions</NavLink>
            <button onClick={() => {
              localStorage.removeItem(GC_USER_ID)
              localStorage.removeItem(GC_AUTH_TOKEN)
              client.resetStore();
              this.props.history.push(`/login`)
            }}>Logout</button>
          </div>
        :
          <div className="Navigation">
            <NavLink to="/login" activeClassName="selected" className="NavLink">Login</NavLink>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(Header)
