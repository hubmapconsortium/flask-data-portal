import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import GridOnRoundedIcon from '@material-ui/icons/GridOnRounded';
import BodyRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSearchViewStore from 'js/stores/useSearchViewStore';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  setToggleItem: state.setToggleItem,
});

function createSearchViewSwitch(labelIconPairs) {
  return function SearchViewSwitch(props) {
    const { toggleItem } = props;
    const { searchView, setSearchView, setToggleItem } = useSearchViewStore(searchViewStoreSelector);

    useEffect(() => {
      setToggleItem(toggleItem);
    }, [setToggleItem, toggleItem]);

    function handleChangeView(view) {
      const validViews = labelIconPairs.map(({ label }) => label.toLowerCase());
      if (!validViews.includes(view)) {
        return;
      }
      setSearchView(view);
      toggleItem(view);
    }

    return (
      <ToggleButtonGroup value={searchView} exclusive onChange={(e, view) => handleChangeView(view)}>
        {labelIconPairs.map(({ label, Icon }) => (
          <TooltipToggleButton
            tooltipComponent={SecondaryBackgroundTooltip}
            tooltipTitle={`Switch to ${label} View`}
            disableRipple
            value={label.toLowerCase()}
            id={`${label.toLowerCase()}-view-toggle-button`}
            key={label}
          >
            <Icon color={searchView === label.toLowerCase() ? 'primary' : 'secondary'} />
          </TooltipToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };
}

const SearchViewSwitch = createSearchViewSwitch([
  { label: 'Table', Icon: ListRoundedIcon },
  { label: 'Tile', Icon: GridOnRoundedIcon },
  { label: 'CCF', Icon: BodyRoundedIcon },
]);

SearchViewSwitch.propTypes = {
  toggleItem: PropTypes.func.isRequired,
};

export default SearchViewSwitch;
