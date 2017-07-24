import React, { Component } from 'react';
import styled from 'emotion/react';
import { Switch, Route } from 'react-router-dom';
import firebase from 'firebase';
import Header, { HeaderTitle } from './Header';
import Main from './Main';
import ViewAllPage from '../ViewAllPage';
import AddNewPage from '../AddNewPage';
import Nav from '../../components/Nav';

const config = {
  apiKey: 'AIzaSyDMv72eVWhuE5HhY-ahe6fiI6QV-fvxOQo',
  authDomain: 'dailyjack-d2fa0.firebaseapp.com',
  databaseURL: 'https://dailyjack-d2fa0.firebaseio.com',
  projectId: 'dailyjack-d2fa0',
  storageBucket: 'dailyjack-d2fa0.appspot.com',
  messagingSenderId: '1069334873975',
};

const pages = [
  { path: '/', label: 'View All', component: ViewAllPage },
  { path: '/add', label: 'Add New', component: AddNewPage },
];

const Container = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #F5E6E8;
`;

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);
  }

  render() {
    return (
      <Container>
        <Nav pages={pages} />
        <Header>
          <HeaderTitle>DailyJack</HeaderTitle>
        </Header>
        <Main>
          <Switch>
            {pages.map(page => (
              <Route
                key={page.path}
                exact
                path={page.path}
                render={props => <page.component {...props} />}
              />
            ))}
          </Switch>
        </Main>
      </Container>
    );
  }
}

export default App;
