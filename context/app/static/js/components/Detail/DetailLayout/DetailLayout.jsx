/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import NoticeAlert from '../../NoticeAlert';
import TableOfContents from '../TableOfContents';
import { FlexColumn, FlexRow } from './style';
import { capitalizeString } from '../../../helpers/functions';

function getSectionFromString(s) {
  if (s === 'metadataTable') {
    return [s, { text: 'Metadata', hash: 'metadata-table' }];
  }
  if (s === 'dagProv') {
    return [s, { text: 'DAG Provenance', hash: 'dag-provenance' }];
  }
  return [s, { text: capitalizeString(s), hash: s }];
}

function getPossibleSections() {
  return [
    'summary',
    'metadata',
    'visualization',
    'attribution',
    'provenance',
    'protocols',
    'metadataTable',
    'files',
    'dagProv',
  ].map((s) => getSectionFromString(s));
}

function testAndDeleteFromObject(toDelete, obj, test) {
  if (test) {
    obj.delete(toDelete);
  }
}

function DetailLayout(props) {
  const { shouldDisplaySection, flashed_messages, children } = props;

  const getSections = () => {
    const sections = new Map(getPossibleSections());
    const sectionsToTest = ['metadata', 'visualization', 'protocols', 'metadataTable', 'files', 'dagProv'];
    sectionsToTest.forEach((section) => testAndDeleteFromObject(section, sections, !shouldDisplaySection[section]));
    return sections;
  };

  const sections = getSections();

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <FlexColumn maxWidth="lg">
        {flashed_messages && flashed_messages.length > 0 && <NoticeAlert errors={flashed_messages} />}
        {children}
      </FlexColumn>
    </FlexRow>
  );
}

DetailLayout.propTypes = {
  shouldDisplaySection: PropTypes.objectOf(PropTypes.bool).isRequired,
  flashed_messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.bool])).isRequired,
};

DetailLayout.defaultProps = {
  flashed_messages: [],
};

export default DetailLayout;
