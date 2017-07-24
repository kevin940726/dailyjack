import React from 'react';
import { NavLink } from 'react-router-dom';
import './nav.css';

const Nav = ({ pages }) => (
  <nav className="c-nav">
    {pages.map(page => (
      <NavLink className="c-nav-link" to={page.path} key={page.path} activeClassName="active">{page.label}</NavLink>
    ))}
  </nav>
);

export default Nav;
