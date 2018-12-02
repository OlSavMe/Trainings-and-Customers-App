import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Customerlist from './Customerlist';
import Traininglist from './Traininglist';

class App extends Component {
  render() {
    return (
      <div className="App">
       <header className="App-header">
          <h1 className="App-title">Customers and trainings</h1>
        </header>
        <BrowserRouter>
        <div>
        <Link to="/customers">Customers</Link>{''}
        <span>|</span><Link to="/trainings">Trainings</Link>{''}
        <Switch>
<Route path="/customers" component={Customerlist} />
<Route path="/trainings" component={Traininglist} />
        </Switch>
        </div>
        </BrowserRouter>
       </div>
    );
  }
}

export default App;


