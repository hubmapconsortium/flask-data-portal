import { buildCollectionsPanelsProps } from './utils';

test('should return the props require for the panel list', () => {
  const collections = [
    {
      _source: {
        uuid: 'abc123',
        title: 'Collection ABC',
        hubmap_id: 'HBM_ABC123',
        datasets: [1, 2, 3],
      },
    },
  ];

  expect(buildCollectionsPanelsProps(collections)).toEqual([
    {
      key: 'abc123',
      href: '/browse/collection/abc123',
      title: 'Collection ABC',
      secondaryText: 'HBM_ABC123',
      rightText: '3 Datasets',
    },
  ]);
});
