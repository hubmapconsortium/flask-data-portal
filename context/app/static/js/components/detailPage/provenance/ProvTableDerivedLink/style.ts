import { styled } from '@mui/material/styles';

const LinkButton = styled('a')(({ theme }) => ({
  color: theme.palette.white.main,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main,
  ...theme.typography.subtitle2,
  marginTop: theme.spacing(1),
  width: '175px',
  boxSizing: 'content-box',
  padding: theme.spacing(1, 4),
  textAlign: 'center',
  '&:hover': {
    boxShadow: theme.shadows[8],
    color: theme.palette.primary.hover,
  },
}));

export { LinkButton };
