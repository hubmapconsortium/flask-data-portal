import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';

import { AppContext } from 'js/components/Providers';
import { getTokenParam } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import DetailContext from 'js/components//Detail/context';
import FilesConditionalLink from '../FilesConditionalLink';
import PDFViewer from '../PDFViewer';
import { StyledRow, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon, QaChip } from './style';
import FilesContext from '../Files/context';

function FileBrowserFile(props) {
  const { fileObj, depth } = props;
  const { hasAgreedToDUA, openDUA } = useContext(FilesContext);
  const { uuid } = useContext(DetailContext);
  const { assetsEndpoint, groupsToken } = useContext(AppContext);

  const tokenParam = getTokenParam(groupsToken);

  const fileUrl = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}${tokenParam}`;

  return (
    <StyledRow>
      <td>
        <IndentedDiv $depth={depth} data-testid="file-indented-div">
          <StyledFileIcon color="primary" />
          <FilesConditionalLink
            href={fileUrl}
            hasAgreedToDUA={hasAgreedToDUA}
            openDUA={() => openDUA(fileUrl)}
            variant="body1"
            download
          >
            {fileObj.file}
          </FilesConditionalLink>
          {fileObj.description && (
            <SecondaryBackgroundTooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`}>
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
        </IndentedDiv>
      </td>
      <td>{fileObj?.is_qa_qc ? <QaChip label="QA" variant="outlined" /> : null}</td>
      <td>{fileObj?.file.endsWith('.pdf') ? <PDFViewer pdfUrl={fileUrl} /> : null}</td>
      <td>
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
      </td>
    </StyledRow>
  );
}

FileBrowserFile.propTypes = {
  fileObj: PropTypes.shape({
    rel_path: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    edam_term: PropTypes.string.isRequired,
    is_qa_qc: PropTypes.bool,
  }).isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserFile;
