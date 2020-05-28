/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';
import SectionItem from './SectionItem';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;
const StyledLink = styled(Link)`
  color: #3781D1;
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;


function Attribution(props) {
  const { assayMetadata } = props;
  const {
    group_name,
    created_by_user_displayname,
    created_by_user_email,
  } = assayMetadata;

  return (
    <SectionContainer id="attribution">
      <SectionHeader variant="h3" component="h2">Attribution</SectionHeader>
      <FlexPaper>
        <SectionItem label="Center">
          <StyledTypography variant="body1">{group_name}</StyledTypography>
        </SectionItem>
        <SectionItem label="Creator" ml={1}>
          <StyledTypography variant="body1">{created_by_user_displayname}</StyledTypography>
          <StyledLink href={`mailto:${encodeURI(created_by_user_email)}`}>{created_by_user_email}</StyledLink>
        </SectionItem>
      </FlexPaper>
    </SectionContainer>
  );
}

export default Attribution;
