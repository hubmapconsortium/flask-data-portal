import esb from 'elastic-builder';
import { stringify } from 'qs';
import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

export interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

export const FACETS = {
  hierarchical: 'HIERARCHICAL',
  term: 'TERM',
  range: 'RANGE',
} as const;

export interface FacetConfig {
  field: string;
  type: (typeof FACETS)[keyof typeof FACETS];
}

export interface TermConfig extends FacetConfig {
  type: typeof FACETS.term;
}

export interface TermValues<V = Set<string>> {
  values: V;
  type: typeof FACETS.term;
}

export interface HierarchicalTermConfig extends FacetConfig {
  childField: string;
  type: typeof FACETS.hierarchical;
}

export interface HierarchichalTermValues<V = Set<string>> {
  values: Record<string, V>;
  type: typeof FACETS.hierarchical;
}

export interface RangeConfig extends FacetConfig {
  min: number;
  max: number;
  type: typeof FACETS.range;
}

export interface RangeValues {
  values: {
    min: number;
    max: number;
  };
  type: typeof FACETS.range;
}

type Filter<V = Set<string>> = TermValues<V> | HierarchichalTermValues<V> | RangeValues;
type Facet = TermConfig | HierarchicalTermConfig | RangeConfig;

export type FiltersType<V = Set<string>> = Record<string, Filter<V>>;
export type FacetsType = Record<string, Facet>;

type SourceFields = Record<string, string[]>;

export interface SearchState<V> {
  filters: FiltersType<V>;
  facets: FacetsType;
  defaultQuery?: esb.Query;
  search: string;
  searchFields: string[];
  sortField: SortField;
  sourceFields: SourceFields;
  view: string;
  size: number;
  endpoint: string;
  swrConfig?: SWRConfiguration;
  type: 'Donor' | 'Sample' | 'Dataset';
  analyticsCategory: string;
}

export type SearchStoreState = SearchState<Set<string>>;
export type SearchURLState = Partial<SearchState<string[]>>;

export interface SearchStoreActions {
  setSearch: (search: string) => void;
  setView: (view: string) => void;
  setSortField: (sortField: SortField) => void;
  filterTerm: ({ term, value }: { term: string; value: string }) => void;
  filterHierarchicalParentTerm: ({
    term,
    value,
    childValues,
  }: {
    term: string;
    value: string;
    childValues: string[];
  }) => void;
  filterHierarchicalChildTerm: ({
    parentTerm,
    parentValue,
    value,
  }: {
    parentTerm: string;
    parentValue: string;
    value: string;
  }) => void;
  filterRange: ({ field, min, max }: { field: string; min: number; max: number }) => void;
}

export interface SearchStore extends SearchStoreState, SearchStoreActions {}

export function isTermFilter<V = Set<string>>(filter: Filter<V>): filter is TermValues<V> {
  return filter.type === 'TERM';
}

export function isTermFacet(facet: Facet): facet is TermConfig {
  return facet.type === 'TERM';
}

export function isRangeFilter<V = Set<string>>(filter: Filter<V>): filter is RangeValues {
  return filter.type === 'RANGE';
}

export function isRangeFacet(facet: Facet): facet is RangeConfig {
  return facet.type === 'RANGE';
}

export function isHierarchicalFilter<V = Set<string>>(filter: Filter<V>): filter is HierarchichalTermValues<V> {
  return filter.type === 'HIERARCHICAL';
}

export function isHierarchicalFacet(facet: Facet): facet is HierarchicalTermConfig {
  return facet.type === 'HIERARCHICAL';
}

export function filterHasValues({ filter, facet }: { filter: Filter; facet: Facet }) {
  if (isTermFilter(filter)) {
    return filter.values.size;
  }

  if (isHierarchicalFilter(filter)) {
    return Object.keys(filter.values).length;
  }

  if (isRangeFilter(filter) && isRangeFacet(facet)) {
    return filter.values.min !== facet.min || filter.values.max !== facet.max;
  }

  return false;
}

function replaceURLSearchParams(state: SearchStoreState) {
  const { search, sortField, filters, facets } = state;

  const filtersWithValues = Object.fromEntries(
    Object.entries(filters).filter(([k, v]) => filterHasValues({ filter: v, facet: facets[k] })),
  );

  const urlState = {
    search,
    sortField,
    filters: filtersWithValues,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const urlStateWithArrays: URLSearchParams = JSON.parse(
    JSON.stringify(urlState, (_key, value: unknown) => (value instanceof Set ? [...value] : value)),
  );

  const urlCopy = new URL(String(window.location));
  urlCopy.search = stringify(urlStateWithArrays);

  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, '', urlCopy);
}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStore>((set) => ({
    ...initialState,
    setSearch: (search) => {
      set((state) => {
        state.search = search;
        replaceURLSearchParams(state);
      });
    },
    setView: (view) => {
      set((state) => {
        state.view = view;
      });
    },
    setSortField: (sortField) => {
      set((state) => {
        state.sortField = sortField;
        replaceURLSearchParams(state);
      });
    },
    filterTerm: ({ term, value }) => {
      set((state) => {
        const filter = state?.filters?.[term];

        if (!isTermFilter(filter)) {
          return;
        }
        const { values } = filter;

        if (values.has(value)) {
          values.delete(value);
        } else {
          values.add(value);
        }
        replaceURLSearchParams(state);
      });
    },
    filterHierarchicalParentTerm: ({ term, value, childValues }) => {
      set((state) => {
        const filter = state?.filters?.[term];

        if (!isHierarchicalFilter(filter)) {
          return;
        }
        const { values } = filter;

        if (value in values) {
          delete values[value];
        } else {
          values[value] = new Set(childValues);
        }
        replaceURLSearchParams(state);
      });
    },
    filterHierarchicalChildTerm: ({ parentTerm, parentValue, value }) => {
      set((state) => {
        const filter = state?.filters?.[parentTerm];

        if (!isHierarchicalFilter(filter)) {
          return;
        }

        const { values } = filter;

        const childValues = values[parentValue] ?? new Set([]);

        if (childValues.has(value)) {
          childValues.delete(value);
        } else {
          childValues.add(value);
        }

        if (childValues.size === 0) {
          delete filter.values[parentValue];
        } else {
          filter.values[parentValue] = childValues;
        }

        replaceURLSearchParams(state);
      });
    },
    filterRange: ({ field, min, max }) => {
      set((state) => {
        const filter = state?.filters[field];

        if (!isRangeFilter(filter)) {
          return;
        }

        filter.values = { min, max };
        replaceURLSearchParams(state);
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
