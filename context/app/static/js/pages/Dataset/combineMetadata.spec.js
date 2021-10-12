import { combineMetadata } from './Dataset';

test('robust against undefined data', () => {
  const donor = undefined;
  const origin_sample = undefined;
  const source_sample = undefined;
  const metadata = undefined;
  expect(combineMetadata(donor, origin_sample, source_sample, metadata)).toEqual({});
});

test('robust against empty objects', () => {
  const donor = {};
  const origin_sample = {};
  const source_sample = [];
  const metadata = {};
  expect(combineMetadata(donor, origin_sample, source_sample, metadata)).toEqual({});
});

test('combines appropiately structured metadata', () => {
  // This information is also available in the "ancestors" list,
  // but metadata is structured differently between Samples and Donors,
  // so it wouldn't simplify things to use that.
  const donor = {
    created_by_user_displayname: 'John Doe',
    mapped_metadata: {
      age_unit: ['years'],
      age_value: [40],
    },
    metadata: {
      // This is the source of the mapped_metadata.
      living_donor_data: [],
    },
  };
  const origin_sample = {
    mapped_organ: 'Kidney (Right)',
    mapped_specimen_type: 'Organ',
    // Currently, not seeing any metadata here, but that may change.
  };
  const source_sample = [
    {
      // mapped_metadata seems to be empty.
      mapped_metadata: {},
      metadata: {
        cold_ischemia_time_unit: 'minutes',
        cold_ischemia_time_value: '1000',
      },
    },
  ];
  const metadata = {
    dag_provenance_list: [],
    extra_metatadata: {},
    metadata: {
      analyte_class: 'polysaccharides',
      assay_category: 'imaging',
      assay_type: 'PAS microscopy',
    },
  };
  expect(combineMetadata(donor, origin_sample, source_sample, metadata)).toEqual({
    analyte_class: 'polysaccharides',
    assay_category: 'imaging',
    assay_type: 'PAS microscopy',
    'donor.age_unit': ['years'],
    'donor.age_value': [40],
    'sample.cold_ischemia_time_unit': 'minutes',
    'sample.cold_ischemia_time_value': '1000',
  });
});
