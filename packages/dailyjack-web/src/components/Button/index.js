import React from 'react';
import './button.css';

const Button = ({ label, handleClick }) => {
  const onClick = () => {
    handleClick();
  };
  return (
    <div className="c-btn" onClick={onClick}>{label}</div>
  );
};

export default Button;
