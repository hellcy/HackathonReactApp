import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Login from './containers/Login'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'

import Amplify from 'aws-amplify'
import config from './aws-exports'
const { NODE_ENV } = process.env
if (NODE_ENV === 'development') {
  config.oauth.redirectSignIn = process.env.REACT_APP_AMPLIFY_REDIRECT_URL
  config.oauth.redirectSignOut = process.env.REACT_APP_AMPLIFY_SIGNOUT_URL
} else {
  config.oauth.redirectSignIn =
    process.env.REACT_APP_AMPLIFY_PRODUCTION_REDIRECT_URL
  config.oauth.redirectSignOut =
    process.env.REACT_APP_AMPLIFY_PRODUCTION_SIGNOUT_URL
}
Amplify.configure(config)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
