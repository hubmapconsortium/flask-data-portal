import {
  appendKeywordToFieldName,
  prependMetadataPathToFieldName,
  buildFieldConfig,
  buildMetadataFieldConfig,
  createField,
  mergeObjects,
} from './utils';

describe('appendKeywordToFieldName', () => {
  test('should append .keyword if type is string', () => {
    expect(appendKeywordToFieldName({ fieldName: 'animal', type: 'string' })).toBe('animal.keyword');
  });

  test('should not append .keyword for non-string types', () => {
    expect(appendKeywordToFieldName({ fieldName: 'animal', type: 'number' })).toBe('animal');
  });
});

describe('appendKeywordToFieldName', () => {
  test('should return the field unaltered if the path for the entity the field belongs to is not defined', () => {
    expect(prependMetadataPathToFieldName({ fieldName: 'animal', entityType: 'dataset' })).toBe('animal');
  });

  test('should return the correct path for donor metadata in samples', () => {
    expect(prependMetadataPathToFieldName({ fieldName: 'age_value', pageEntityType: 'sample' })).toBe(
      'donor.mapped_metadata.age_value',
    );
  });

  test('should return the correct path for donor metadata in datasets', () => {
    expect(prependMetadataPathToFieldName({ fieldName: 'age_value', pageEntityType: 'dataset' })).toBe(
      'donor.mapped_metadata.age_value',
    );
  });

  test('should return the correct path for sample metadata in datasets', () => {
    expect(prependMetadataPathToFieldName({ fieldName: 'health_status', pageEntityType: 'dataset' })).toBe(
      'source_sample.metadata.health_status',
    );
  });

  test('should return the correct path for dataset metadata in datasets', () => {
    expect(prependMetadataPathToFieldName({ fieldName: 'assay_category', pageEntityType: 'dataset' })).toBe(
      'metadata.metadata.assay_category',
    );
  });
});

test('buildFieldConfig should build field config', () => {
  expect(buildFieldConfig({ fieldName: 'animal', label: 'Animal', type: 'string' })).toEqual({
    animal: {
      field: 'animal.keyword',
      identifier: 'animal',
      label: 'Animal',
      type: 'string',
      configureGroup: 'General',
      facetGroup: 'Additional Facets',
    },
  });
});

test('buildMetadataFieldConfig should build metadata field config', () => {
  expect(
    buildMetadataFieldConfig({ fieldName: 'assay_category', entityType: 'dataset', label: 'Assay Category' }),
  ).toEqual({
    'metadata.metadata.assay_category': {
      field: 'metadata.metadata.assay_category.keyword',
      identifier: 'metadata.metadata.assay_category',
      label: 'Assay Category',
      type: 'string',
      configureGroup: 'Dataset Metadata',
      facetGroup: 'Dataset Metadata',
    },
  });
});

describe('createField', () => {
  test('should create a non-metadata field config if the field does not exist in metadata field types', () => {
    expect(createField({ fieldName: 'animal', label: 'Animal', type: 'string' })).toEqual({
      animal: {
        field: 'animal.keyword',
        identifier: 'animal',
        label: 'Animal',
        type: 'string',
        configureGroup: 'General',
        facetGroup: 'Additional Facets',
      },
    });
  });

  test('should create a metadata field config if the field exists in metadata field types', () => {
    expect(createField({ fieldName: 'assay_category', entityType: 'dataset', label: 'Assay Category' })).toEqual({
      'metadata.metadata.assay_category': {
        field: 'metadata.metadata.assay_category.keyword',
        identifier: 'metadata.metadata.assay_category',
        label: 'Assay Category',
        type: 'string',
        configureGroup: 'Dataset Metadata',
        facetGroup: 'Dataset Metadata',
      },
    });
  });
});

test('mergeObjects should merge objects with unique keys', () => {
  expect(mergeObjects([{ a: 1, b: 2 }, { c: 3 }])).toEqual({ a: 1, b: 2, c: 3 });
});
