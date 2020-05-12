import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import OtherPage from './OtherPage'
import Fib from "./Fib"
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        <Route exact path="/" component={Fib} />
        <Route exact path="/otherpage" component={OtherPage} />
      </div>
    </Router>
  );
}

export default App;
