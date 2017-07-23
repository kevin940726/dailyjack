import React from 'react';
import './card.css';

const Card = ({ title, author, contents, id }) => (
  <section className="c-card">
    <div className="c-card-hearder">
      <p className="c-card-comment">#{id}</p>
      <h3 className="c-card-title">{title}</h3>
    </div>
    <div className="c-card-content">
      {
        contents.map((item, index) => (
          <p className="c-card-desc" key={index}>{item}</p>
        ))
      }
    </div>
    <span className="c-card-author">{author}</span>
  </section>
);

export default Card;
