import React from 'react';
import styled from 'emotion/react';
import NavLink from './NavLink';
import { NAV_HEIGHT, ACTIVE_CLASS_NAME } from './constants';

const NavWrapper = styled.nav`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  text-align: right;
  height: ${NAV_HEIGHT}px;
  background: #222
`;

const Nav = ({ pages }) => (
  <NavWrapper>
    {pages.map(page => (
      <NavLink
        key={page.path}
        exact
        to={page.path}
        activeClassName={ACTIVE_CLASS_NAME}
      >
        {page.label}
      </NavLink>
    ))}
  </NavWrapper>
);

export default Nav;
