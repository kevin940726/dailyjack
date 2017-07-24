import React from 'react';
import Divider from '../Divider';
import './inputItem.css';

const InputItem = ({ label, field, value, handleInputChange, isChangeing }) => {
  const onInputChange = (e) => {
    handleInputChange(field, e.target.value);
  };

  return (
    <section className="c-input-item">
      <label className={`c-input-label c-input-label--${isChangeing ? 'uppper' : ''}`}>{label}</label>
      <input className="c-input-text" value={value} onChange={onInputChange} />
      <Divider />
    </section>
  );
};

export default InputItem;
