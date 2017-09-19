import React, { Component } from 'react'
import QuestionList from './QuestionList'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import Header from './Header'
import PrivateRoute from './PrivateRoute'

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Switch>
            <PrivateRoute exact path='/' component={QuestionList}/>
            <Route exact path='/login' component={Login}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
