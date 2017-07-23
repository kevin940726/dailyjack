import React, { Component } from 'react';
import firebase from 'firebase';
import Card from '../../components/CardList';
import './viewAllPage.css';

class ViewAllPage extends Component {
  state = {
    jacks: [],
  };

  componentDidMount() {
    Promise.resolve()
      .then(() => firebase.database().ref()
        .once('value')
        .then(rootData => rootData.child('jacks').val())
      )
      .then((jacks) => {
        this.setState({
          jacks: Object.keys(jacks).map(key => jacks[key]),
        });
      });
  }

  render() {
    const { jacks = [] } = this.state;
    return (
      <section className="l-page l-page-view-all">
        {
          jacks.map((comment, index) => (
            <Card
              key={index}
              author={comment.author}
              contents={comment.contents}
              title={comment.title}
              id={index + 1}
            />
          ))
        }
      </section>
    );
  }
}

export default ViewAllPage;
