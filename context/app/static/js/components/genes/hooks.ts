import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr';
import { useGenePageContext } from './GenePageContext';
import { useAppContext } from '../Contexts';

const useGeneApiURLs = () => {
  const { ubkgEndpoint } = useAppContext();
  return useMemo(
    () => ({
      detailURL(geneId: string) {
        return `${ubkgEndpoint}/gene/${geneId}`;
      },
      get list() {
        return `${ubkgEndpoint}/genes`;
      },
    }),
    [ubkgEndpoint],
  );
};

interface BasicGeneInfo {
  approved_name: string;
  approved_symbol: string;
  summary: string;
}

interface GeneListResponse {
  description: string;
  page: number;
  total_pages: number;
  starts_with: string;
  gene_count: number;
  genes: BasicGeneInfo[];
}

interface GeneDetail extends BasicGeneInfo {
  alias_names: string[];
  alias_symbols: string[];
  cell_types: {
    definition: string;
    id: string;
    name: string;
    organs: {
      id: string;
      source: string;
      name: string;
    }[];
    sources: string[];
  };
  previous_symbols: string[];
  previous_names: string[];
  references: {
    id: string;
    source: string;
    url: string;
  }[];
}

type GeneDetailResponse = [GeneDetail];

const useGeneDetails = () => {
  const { geneSymbol } = useGenePageContext();
  const { data, ...swr } = useSWR<GeneDetailResponse>(useGeneApiURLs().detailURL(geneSymbol), (url: string) =>
    fetcher({ url }),
  );
  return { data: data?.[0], ...swr };
};

const genesperpage = 10;
const starts_with = undefined;

const useGeneList = (page: number) => {
  const query = useMemo(
    () => ({
      page,
      genesperpage,
      starts_with,
    }),
    [page],
  );
  return useSWR<GeneListResponse>([useGeneApiURLs().list, query], ([url, body]: [string, object]) =>
    fetcher({ url, requestInit: { body: JSON.stringify(body) } }),
  );
};

// Re-export `useGenePageContext` for convenience
export { useGeneDetails, useGeneList, useGenePageContext };
