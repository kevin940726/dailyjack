import { NavLink as Link } from 'react-router-dom';
import styled from 'emotion/react';
import { NAV_HEIGHT, ACTIVE_CLASS_NAME } from './constants';

const NavLink = styled(Link)`
  display: inline-block;
  color: white;
  text-decoration: none;
  height: ${NAV_HEIGHT}px;
  padding: 0 20px;
  line-height: ${NAV_HEIGHT}px;

  &.${ACTIVE_CLASS_NAME} {
    background: rgba(255, 255, 255, .2);
  }
`;

export default NavLink;
