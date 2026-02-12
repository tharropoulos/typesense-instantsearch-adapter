import type { SearchClient as AlgoliaSearchClient, CompositionClient } from "instantsearch.js";

type SearchClient = CompositionClient | AlgoliaSearchClient;

import type { ConfigurationOptions } from "typesense/lib/Typesense/Configuration";
import type {
  DocumentSchema,
  SearchParamsWithPreset,
  SearchResponse,
  SearchResponseHit,
  SearchResponseFacetCountSchema,
} from "typesense/lib/Typesense/Documents";
import { default as TypesenseSearchClient } from "typesense/lib/Typesense/SearchClient";
import type { UnionSearchResponse } from "typesense/lib/Typesense/Types";

interface BaseSearchParameters<T extends DocumentSchema, Infix extends string = string>
  extends Partial<Omit<SearchParamsWithPreset<T, Infix>, "q" | "filter_by">> {
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  queryByWeights?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  sortBy?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  maxFacetValues?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  perPage?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  includeFields?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  excludeFields?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  highlightFields?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  highlightFullFields?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  numTypos?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  typoTokensThreshold?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  dropTokensThreshold?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  pinnedHits?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  hiddenHits?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  enableOverrides?: boolean;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  preSegmentedQuery?: boolean;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  limitHits?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  groupBy?: string;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  groupLimit?: number;
  /**
   * @deprecated Please use the snake_cased version of this parameter
   */
  exhaustiveSearch?: boolean;
}

interface BaseAdapterOptions {
  server: ConfigurationOptions;
  geoLocationField?: string;
  facetableFieldsWithSpecialCharacters?: string[];
  renderingContent?: object;
  flattenGroupedHits?: boolean;
  facetByOptions?: object;
  collectionSpecificFacetByOptions?: object;
  filterByOptions?: object;
  collectionSpecificFilterByOptions?: object;
  sortByOptions?: object;
  collectionSpecificSortByOptions?: object;
  /**
   * For Typesense versions before v30, set to true to use override_tags.
   * For v30+, leave as false (default) to use curation_tags.
   */
  useOverrideTags?: boolean;
}

type CollectionSearchParameters = Record<string, BaseSearchParameters<DocumentSchema>>;

interface AdditionalSearchParametersWithQueryBy<T extends DocumentSchema> extends BaseAdapterOptions {
  additionalSearchParameters: BaseSearchParameters<T>;
}

interface AdditionalSearchParametersOptionalQueryBy<T extends DocumentSchema> extends BaseAdapterOptions {
  additionalSearchParameters?: BaseSearchParameters<T>;
}

interface CollectionSpecificSearchParametersWithQueryBy extends BaseAdapterOptions {
  collectionSpecificSearchParameters: CollectionSearchParameters;
}

interface CollectionSpecificSearchParametersOptionalQueryBy extends BaseAdapterOptions {
  collectionSpecificSearchParameters?: CollectionSearchParameters;
}

type AdapterOptionsWithQueryByInAdditionalSearchParameters<T extends DocumentSchema> =
  AdditionalSearchParametersWithQueryBy<T> & CollectionSpecificSearchParametersOptionalQueryBy;
type AdapterOptionWithQueryByInCollectionSpecificSearchParameters<T extends DocumentSchema> =
  AdditionalSearchParametersOptionalQueryBy<T> & CollectionSpecificSearchParametersWithQueryBy;

type TypesenseInstantsearchAdapterOptions<T extends DocumentSchema = DocumentSchema> =
  | AdapterOptionWithQueryByInCollectionSpecificSearchParameters<T>
  | AdapterOptionsWithQueryByInAdditionalSearchParameters<T>;

export type TypesenseSearchResponse<T extends DocumentSchema = DocumentSchema> =
  | SearchResponse<T>
  | UnionSearchResponse<T>;

export interface InstantSearchRequest {
  indexName?: string;
  params: {
    highlightPreTag?: string;
    highlightPostTag?: string;
    facetName?: string;
    [key: string]: unknown;
  };
}

export interface SearchResponseAdapterConfiguration {
  geoLocationField?: string;
  flattenGroupedHits?: boolean;
  renderingContent?: Record<string, unknown>;
}

export type AdaptedHighlightValue = {
  value: string;
  matchLevel: "none" | "full";
  matchedWords: string[];
  matchedIndices?: number[];
};

export type AdaptedHighlightResult =
  | AdaptedHighlightValue
  | AdaptedHighlightResult[]
  | { [key: string]: AdaptedHighlightResult };

export type AdaptedHighlightResultRecord = Record<string, AdaptedHighlightResult>;

export type AdaptedSearchHit<T extends DocumentSchema = DocumentSchema> = T & {
  objectID: string | number;
  _snippetResult: AdaptedHighlightResultRecord;
  _highlightResult: AdaptedHighlightResultRecord;
  _rawTypesenseHit: SearchResponseHit<T>;
  _rawTypesenseConversation?: SearchResponse<T>["conversation"];
  _geoloc?: { lat: number; lng: number };
  _group_key?: string[];
  group_key?: string[];
  _group_found?: number;
  _grouped_hits?: AdaptedSearchHit<T>[];
  text_match?: number;
  geo_distance_meters?: SearchResponseHit<T>["geo_distance_meters"];
  curated?: true;
  text_match_info?: SearchResponseHit<T>["text_match_info"];
  hybrid_search_info?: unknown;
  vector_distance?: number;
  collection?: string;
  search_index?: string;
};

export type ConversationHit<T extends DocumentSchema = DocumentSchema> = {
  _rawTypesenseConversation: SearchResponse<T>["conversation"];
};

export type AdaptedSearchResponseHit<T extends DocumentSchema = DocumentSchema> =
  | AdaptedSearchHit<T>
  | ConversationHit<T>;

export type AdaptedFacets = Record<string, Record<string, number>>;
export type AdaptedFacetStats<T extends DocumentSchema = DocumentSchema> = Record<
  string,
  SearchResponseFacetCountSchema<T>["stats"]
>;
export type RenderingContent = Record<string, unknown>;

export interface AdaptedSearchResponse<T extends DocumentSchema = DocumentSchema> {
  hits: AdaptedSearchResponseHit<T>[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: AdaptedFacets;
  facets_stats: AdaptedFacetStats<T>;
  query: string;
  processingTimeMS: number;
  renderingContent?: RenderingContent;
  appliedRules?: string[];
  userData?: Array<NonNullable<SearchResponse<T>["metadata"]>>;
  parsed_nl_query?: SearchResponse<T>["parsed_nl_query"];
}

export class SearchResponseAdapter<T extends DocumentSchema = DocumentSchema> {
  constructor(
    typesenseResponse: TypesenseSearchResponse<T>,
    instantsearchRequest: InstantSearchRequest,
    configuration?: SearchResponseAdapterConfiguration,
    allTypesenseResults?: SearchResponse<T>[],
    fullTypesenseResponse?: TypesenseSearchResponse<T> | { conversation?: SearchResponse<T>["conversation"] },
  );

  typesenseResponse: TypesenseSearchResponse<T>;
  instantsearchRequest: InstantSearchRequest;
  configuration?: SearchResponseAdapterConfiguration;
  allTypesenseResults: SearchResponse<T>[];
  fullTypesenseResponse?: TypesenseSearchResponse<T> | { conversation?: SearchResponse<T>["conversation"] };

  _adaptGroupedHits(typesenseGroupedHits: NonNullable<SearchResponse<T>["grouped_hits"]>): AdaptedSearchHit<T>[];
  _adaptHits(typesenseHits: NonNullable<SearchResponse<T>["hits"]>): AdaptedSearchHit<T>[];
  _adaptHighlightResult(
    typesenseHit: SearchResponseHit<T>,
    snippetOrValue: "snippet" | "value",
  ): AdaptedHighlightResultRecord;
  isHighlightPost0240RCN32Format(highlight: SearchResponseHit<T>["highlight"]): boolean;
  adaptHighlightsArray(
    typesenseHit: SearchResponseHit<T>,
    result: AdaptedHighlightResultRecord,
    snippetOrValue: "snippet" | "value",
  ): void;
  adaptHighlightObject(
    typesenseHit: SearchResponseHit<T>,
    result: AdaptedHighlightResultRecord,
    snippetOrValue: "snippet" | "value",
  ): void;
  _adaptHighlightInObjectValue(
    objectValue: Record<string, unknown>,
    highlightObjectValue: Record<string, unknown>,
    snippetOrValue: "snippet" | "value",
  ): AdaptedHighlightResult;
  _adaptHighlightInArrayValue(
    arrayValue: unknown[],
    highlightArrayValue: unknown[],
    snippetOrValue: "snippet" | "value",
  ): AdaptedHighlightResult[];
  _adaptHighlightInPrimitiveValue(
    primitiveValue: string | number | boolean,
    highlightPrimitiveValue: Record<string, unknown> | undefined,
    snippetOrValue: "snippet" | "value",
  ): AdaptedHighlightValue;
  _adaptHighlightNullValue(): AdaptedHighlightValue;
  _adaptFacets(typesenseFacetCounts?: SearchResponseFacetCountSchema<T>[]): AdaptedFacets;
  _adaptFacetStats(typesenseFacetCounts?: SearchResponseFacetCountSchema<T>[]): AdaptedFacetStats<T>;
  _adaptRenderingContent(typesenseFacetCounts?: SearchResponseFacetCountSchema<T>[]): RenderingContent;
  _adaptUserData(metadata: SearchResponse<T>["metadata"]): Array<NonNullable<SearchResponse<T>["metadata"]>>;
  adapt(): AdaptedSearchResponse<T>;

  _adaptHighlightTag(value: string, highlightPreTag?: string, highlightPostTag?: string): string;
  _adaptNumberOfPages(): number;
}

export default class TypesenseInstantsearchAdapter<T extends DocumentSchema = DocumentSchema> {
  readonly searchClient: SearchClient;
  readonly typesenseClient: TypesenseSearchClient;
  constructor(options: TypesenseInstantsearchAdapterOptions<T>);
  clearCache(): SearchClient;
  updateConfiguration(options: TypesenseInstantsearchAdapterOptions<T>): boolean;
}
