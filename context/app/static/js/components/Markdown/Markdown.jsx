import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import Typography from '@material-ui/core/Typography';

import { StyledPaper } from './style';

function Markdown(props) {
  const { markdown } = props;
  const html = marked(markdown);

  return (
    <StyledPaper>
      <Typography variant="body1">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Typography>
    </StyledPaper>
  );
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Markdown;
