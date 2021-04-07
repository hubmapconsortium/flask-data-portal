import React from 'react';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SelectionButton } from './style';

function AssayTypeBarChartDropdown({ colorDataOptions, selectedColorDataIndex, setSelectedColorDataIndex }) {
  return (
    <DropdownListbox
      buttonComponent={SelectionButton}
      optionComponent={DropdownListboxOption}
      selectedOptionIndex={selectedColorDataIndex}
      options={colorDataOptions}
      selectOnClick={setSelectedColorDataIndex}
      getOptionLabel={(v) => v.name}
      buttonProps={{ variant: 'outlined' }}
    />
  );
}

export default AssayTypeBarChartDropdown;
