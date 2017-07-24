import React, { Component } from 'react';
import {
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';
import firebase from 'firebase';
import ViewAllPage from '../ViewAllPage';
import AddNewPage from '../AddNewPage';
import Nav from '../../components/Nav';
import './App.css';

const config = {
  apiKey: 'AIzaSyDMv72eVWhuE5HhY-ahe6fiI6QV-fvxOQo',
  authDomain: 'dailyjack-d2fa0.firebaseapp.com',
  databaseURL: 'https://dailyjack-d2fa0.firebaseio.com',
  projectId: 'dailyjack-d2fa0',
  storageBucket: 'dailyjack-d2fa0.appspot.com',
  messagingSenderId: '1069334873975',
};

const pages = [
  { path: '/view-all', label: 'View All', component: ViewAllPage },
  { path: '/add-new', label: 'Add New', component: AddNewPage },
];

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
  }

  render() {
    return (
      <div className="app-container">
        <Nav pages={pages} />
        <header className="c-header">
          <h1 className="c-header-title">DailyJack</h1>
        </header>
        <main id="main">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/view-all" />
            </Route>
            {pages.map(page => (
              <Route path={page.path} component={page.component} key={page.path} />
            ))}
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
