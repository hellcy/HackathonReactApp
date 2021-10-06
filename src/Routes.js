import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import Signup from './containers/Signup'
import Main from './containers/Main'
import VideoList from './containers/VideoList'
import VideoResult from './containers/VideoResult'

import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

export default function Routes() {
  function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

  const query = useQuery()

  return (
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/main">
        <Main />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/videoList">
        <VideoList />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/videoResult">
        <VideoResult filename={query.get('filename')} />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
