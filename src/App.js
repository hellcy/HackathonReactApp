import logo from './logo.svg';
import './App.css';

import { Auth } from 'aws-amplify'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={() => Auth.federatedSignIn( { provider: "Google"})}
        >Sign in with Google</button>
      </header>
    </div>
  );
}

export default App;
