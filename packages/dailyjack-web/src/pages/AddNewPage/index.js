import React, { Component } from 'react';
import firebase from 'firebase';
import InputItem from '../../components/InputItem';
import Button from '../../components/Button';
import Wrapper from './Wrapper';

class AddNewPage extends Component {
  constructor(props) {
    super(props);
    this.dbRef = firebase.database().ref();
    this.jacksRef = this.dbRef.child('jacks');
    this.totalJacksRef = this.dbRef.child('totalJacks');
  }

  state = {
    title: '',
    content: '',
    author: '',
    isChanging: {
      title: false,
      content: false,
      author: false,
    },
  };

  initState = () => {
    this.setState({
      title: '',
      content: '',
      author: '',
      isChanging: {
        title: false,
        content: false,
        author: false,
      },
    });
  }

  onInputChange = (type, value) => {
    this.setState({
      [type]: value,
      isChanging: Object.assign(this.state.isChanging, {
        [type]: !!value,
      }),
    });
  }

  handleClick = () => {
    const { title, content, author } = this.state;
    if (!title || !content || !author) {
      return;
    }
    this.dbRef.transaction((rowData) => {
      return rowData
        ? ({
          jacks: rowData.jacks.concat({
            author,
            title,
            contents: [content],
            isLimited: false,
            createdTime: Date.now(),
            id: rowData.jacks.length,
          }),
          totalJacks: rowData.totalJacks + 1,
        })
        : rowData;
    })
    .then(() => {
      this.initState();
    });
  }

  render() {
    const { title, content, author, isChanging } = this.state;
    return (
      <Wrapper>
        <InputItem
          label="標題"
          field="title"
          value={title}
          handleInputChange={this.onInputChange}
          isChangeing={isChanging.title}
        />
        <InputItem
          label="備註"
          field="content"
          value={content}
          handleInputChange={this.onInputChange}
          isChangeing={isChanging.content}
        />
        <InputItem
          label="作者"
          field="author"
          value={author}
          handleInputChange={this.onInputChange}
          isChangeing={isChanging.author}
        />
        <Button label="新增" handleClick={this.handleClick} />
      </Wrapper>
    );
  }
}

export default AddNewPage;
