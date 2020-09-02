/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/named
import { filter, rangeFilter, field } from './utils';

const bmiField = 'body_mass_index_value';
const ageField = 'age_value';

function makeDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';
  return [
    filter(`${pathPrefix}mapped_metadata.sex`, `${labelPrefix}Sex`),
    rangeFilter(`${pathPrefix}mapped_metadata.${ageField}`, `${labelPrefix}Age`, 0, 100),
    filter(`${pathPrefix}mapped_metadata.race`, `${labelPrefix}Race`),
    rangeFilter(`${pathPrefix}mapped_metadata.${bmiField}`, `${labelPrefix}BMI`, 0, 50),
  ];
}

export const affiliationFilters = [filter('group_name', 'Group'), filter('created_by_user_displayname', 'Creator')];

export const donorConfig = {
  filters: {
    'Donor Metadata': makeDonorMetadataFilters(true),
    Affiliation: affiliationFilters,
  },
  fields: [
    field('display_doi', 'Donor'),
    field('group_name', 'Group'),
    field(`mapped_metadata.${ageField}`, 'Age'),
    field(`mapped_metadata.${bmiField}`, 'BMI'),
    field('mapped_metadata.sex', 'Sex'),
    field('mapped_metadata.race', 'Race'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};

export const sampleConfig = {
  filters: {
    'Sample Metadata': [filter('origin_sample.mapped_organ', 'Organ'), filter('mapped_specimen_type', 'Specimen Type')],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: [
    field('display_doi', 'Sample'),
    field('group_name', 'Group'),
    field('mapped_specimen_type', 'Speciment Type'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};

export const datasetConfig = {
  filters: {
    'Dataset Metadata': [
      filter('mapped_data_types', 'Data Type'),
      filter('origin_sample.mapped_organ', 'Organ'),
      filter('source_sample.mapped_specimen_type', 'Specimen Type'),
      filter('mapped_status', 'Status'),
      filter('mapped_data_access_level', 'Access Level'),
    ],
    'Donor Metadata': makeDonorMetadataFilters(false),
    Affiliation: affiliationFilters,
  },
  fields: [
    field('display_doi', 'Dataset'),
    field('group_name', 'Group'),
    field('mapped_data_types', 'Data Types'),
    field('origin_sample.mapped_organ', 'Organ'),
    field('mapped_status', 'Status'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};

export const fallbackConfig = {
  filters: {
    Basics: [
      // 'entity_type' filter would make sense, but it is hidden for the other searches.
      filter('mapped_status', 'Status'),
      filter('mapped_data_access_level', 'Access Level'),
    ],
  },
  fields: [
    field('display_doi', 'ID'),
    field('entity_type', 'Entity Type'),
    field('mapped_status', 'Status'),
    field('mapped_data_access_level', 'Access Level'),
    field('mapped_last_modified_timestamp', 'Last Modified'),
  ],
};
