import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan, WarningDropdownLink } from './style';

function UserLinks({ isAuthenticated, userEmail }) {
  const { workspacesUsers } = useContext(AppContext);

  return (
    <Dropdown title={<TruncatedSpan>{isAuthenticated ? userEmail || 'User' : 'User Profile'}</TruncatedSpan>}>
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      {workspacesUsers.includes(userEmail) ? <DropdownLink href="/workspaces">My Workspaces</DropdownLink> : null}
      <StyledDivider />
      {isAuthenticated ? (
        <WarningDropdownLink href="/logout">Log Out</WarningDropdownLink>
      ) : (
        <DropdownLink href="/login">Log In</DropdownLink>
      )}
    </Dropdown>
  );
}

UserLinks.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default UserLinks;
