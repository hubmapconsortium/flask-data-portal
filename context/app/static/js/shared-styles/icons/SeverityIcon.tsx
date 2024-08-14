import React from 'react';
import { InfoRounded, ErrorRounded, WarningRounded, CheckCircleRounded } from '@mui/icons-material';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

type IconStatus = 'info' | 'success' | 'warning' | 'error';

export interface ColoredStatusIconProps extends SvgIconProps {
  $iconStatus: IconStatus;
}

export const iconSymbolStatusMap: Record<IconStatus, React.ComponentType<SvgIconProps>> = {
  info: InfoRounded,
  success: CheckCircleRounded,
  warning: WarningRounded,
  error: ErrorRounded,
};

function SeverityIcon({ status, ...svgIconProps }: Partial<SvgIconProps> & { status: IconStatus }) {
  return <SvgIcon color={status} component={iconSymbolStatusMap[status]} {...svgIconProps} />;
}

export default SeverityIcon;
