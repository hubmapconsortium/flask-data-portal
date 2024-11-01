import React from 'react';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { BulkDownloadDataset } from 'js/stores/useBulkDownloadStore';

interface RelatedEntitiesSectionHeaderProps {
  searchPageHref: string;
  datasets: BulkDownloadDataset[];
}

export function RelatedEntitiesSectionActions({ searchPageHref, datasets }: RelatedEntitiesSectionHeaderProps) {
  const {
    entity: { uuid },
  } = useFlaskDataContext();
  const { openDialog } = useBulkDownloadDialog();

  const track = useTrackEntityPageEvent();

  return (
    <Stack direction="row" spacing={1}>
      {datasets && (
        <WhiteBackgroundIconTooltipButton tooltip="Download dataset manifest" onClick={() => openDialog(datasets)}>
          <SvgIcon color="primary" component={Download} />
        </WhiteBackgroundIconTooltipButton>
      )}
      <Button
        variant="contained"
        color="primary"
        component="a"
        href={searchPageHref}
        onClick={() =>
          track({
            action: `Derived Datasets Navigation / Navigate to Derived Datasets Search Page`,
            label: uuid,
          })
        }
        data-testid="view-related-data-button"
      >
        View Data on Search Page
      </Button>
    </Stack>
  );
}

export default RelatedEntitiesSectionActions;
