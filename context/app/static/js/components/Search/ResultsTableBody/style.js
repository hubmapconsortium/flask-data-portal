import styled from 'styled-components';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

const StyledTableBody = styled(TableBody)`
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  background-color: ${(props) => props.theme.palette.white.main};

  :hover {
    filter: ${(props) => props.theme.palette.white.hover};
  }

  // Material would apply this on TD, but we override, so there is no internal border above the highlight.
  border: 1px solid ${(props) => props.theme.palette.divider};

  border-left: none;
  border-right: none;
`;

const interPadding = `${16 * 0.6}px`;
const sidePadding = '64px';

const StyledTableRow = styled(TableRow)`
  border: 0;

  &.before-highlight td {
    padding-bottom: 0px;
  }

  &.highlight td {
    padding-top: ${interPadding};
    padding-left: ${sidePadding};
    padding-right: ${sidePadding};
    & p {
      color: rgba(0, 0, 0, 0.54);
      margin: 0px;
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  // Borders handled by tbody.
  border: none;

  // Elastic search injects <em> when showing matches in context.
  em {
    font-weight: bold;
    font-style: normal;
  }
`;

export { StyledTableRow, StyledTableBody, StyledTableCell };
