import React, { ComponentProps, ComponentType } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';

import Tile from 'js/shared-styles/tiles/Tile/';
import { DatasetIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { Entity } from 'js/components/types';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import EntityTileFooter from '../EntityTileFooter/index';
import EntityTileBody from '../EntityTileBody/index';
import { StyledIcon } from './style';

const tileWidth = 310;

interface EntityTileProps
  extends Omit<ComponentProps<typeof Tile>, 'icon' | 'bodyContent' | 'footerContent' | 'tileWidth'>,
    Pick<Entity, 'entity_type'> {
  uuid: string;
  id: string;
  invertColors?: boolean;
  entityData: Partial<Entity>;
  descendantCounts: Record<string, number>;
}

function EntityTile({ uuid, entity_type, id, invertColors, entityData, descendantCounts, ...rest }: EntityTileProps) {
  const icon: ComponentType = entity_type in entityIconMap ? entityIconMap[entity_type] : DatasetIcon;
  return (
    <Tile
      href={`/browse/${entity_type.toLowerCase()}/${uuid}`}
      invertColors={invertColors}
      icon={<StyledIcon as={icon} />}
      bodyContent={
        <EntityTileBody
          entity_type={entity_type}
          id={id}
          invertColors={invertColors}
          entityData={{ ...entityData, entity_type }}
        />
      }
      footerContent={
        <EntityTileFooter
          invertColors={invertColors}
          last_modified_timestamp={entityData.last_modified_timestamp}
          descendantCounts={descendantCounts}
        />
      }
      tileWidth={tileWidth}
      {...rest}
    />
  );
}

function ErrorTile({ entity_type, id }: Pick<EntityTileProps, 'id' | 'entity_type'>) {
  const entityTypeLowercase = entity_type.toLowerCase();
  const copy = useHandleCopyClick();
  return (
    <Tile
      icon={
        <StatusIcon
          status="error"
          sx={{ fontSize: '1.5rem', marginRight: (theme) => theme.spacing(1), alignSelf: 'start' }}
        />
      }
      bodyContent={
        <>
          <Tile.Title>Unable to load {entityTypeLowercase}.</Tile.Title>
          <Typography variant="body2">
            Please <ContactUsLink /> with the {entityTypeLowercase}&apos;s ID for more information.
          </Typography>
          <Typography variant="body2">
            ID:{' '}
            <IconLink
              onClick={(e) => {
                e.preventDefault();
                copy(id);
              }}
              href="#"
              icon={
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              }
            >
              {id}
            </IconLink>
          </Typography>
        </>
      }
      footerContent={undefined}
      tileWidth={tileWidth}
    />
  );
}

export { tileWidth, ErrorTile };
export default EntityTile;
