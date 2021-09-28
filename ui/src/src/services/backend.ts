import qs from "qs";
import * as Utils from "../common/Utils";
import {
  ExistingAttribute,
  ExistingSuite,
  Meta,
  SuiteDraft,
  WithID,
  FakeAttribute,
  ExistingAttributeFilter,
  TimeMeta,
  DeletedMeta,
  AttributeFilterDraft,
  ExistingTestCase,
  RootTestCaseGroup,
} from "../domain";

export const getApiBaseUrl = (url: string) => (process.env.REACT_APP_BASE_API_URL || "/api/") + url;
const getOptions = (options?: RequestInit) => ({
  ...options,
  credentials: "include" as RequestCredentials,
});

export type HttpMethod = "GET" | "PUT" | "DELETE" | "POST";

const fetchInternal = (url: string, method: HttpMethod, options?: RequestInit) =>
  fetch(getApiBaseUrl(url), { ...getOptions(options), method })
    .then(async response => {
      if (!response.ok) {
        if (response.status === 401 && window.location.pathname !== "/login") {
          window.location.href = "/login?" + qs.stringify({ retpath: window.location.pathname });
        } else {
          throw new Error(await response.text());
        }
      }
      return response;
    })
    .catch(error => {
      Utils.onErrorMessage("Couldn't fetch testsuite: ", error);
      throw error;
    });
const fetchJSON = (url: string, method: HttpMethod, options?: RequestInit) =>
  fetchInternal(url, method, options).then(response => response.json());

const getMutationOptions = <TBody>(body: TBody) => ({
  body: JSON.stringify(body),
  headers: { "content-type": "application/json" },
});

const backend = {
  get: <TBody>(url: string, options?: RequestInit) => fetchJSON(url, "GET", options) as Promise<TBody>,
  post: <TBody>(url: string, body: TBody) => fetchJSON(url, "POST", getMutationOptions(body)),
  delete: (url: string) => fetchInternal(url, "DELETE"),
  put: <TBody>(url: string, body: TBody) => fetchJSON(url, "PUT", getMutationOptions(body)),
};

export interface TestCasesFilter {}
type ServerAttribute = Meta &
  WithID & {
    readonly name: string;
    readonly values: string[];
    readonly attrValues: { readonly uuid: string; readonly value: string }[];
  };
const mapServerAttributeToClient = (attribute: ServerAttribute) => ({
  ...copyMeta(attribute),
  id: attribute.id,
  name: attribute.name,
  values: attribute.attrValues
    ? attribute.attrValues.map(({ uuid, value }) => ({ id: uuid, name: value }))
    : attribute.values.map(value => ({ id: value.toLowerCase(), name: value })),
});

const mapServerAttributesToClient = (response: ServerAttribute[]): (ExistingAttribute | FakeAttribute)[] => {
  const clientAttributes = response.map(mapServerAttributeToClient);
  const attributes = clientAttributes.sort((a, b) => (a.name || "").localeCompare(b.name));
  return [
    {
      id: "broken",
      name: "Broken",
      values: [
        { id: "true", name: "True" },
        { id: "false", name: "False" },
      ],
    },
    ...attributes,
  ];
};

const mapFiltersToQueryParams = (filters: AttributeFilterDraft[]): string =>
  filters
    .reduce<{ key: string; value: string }[]>(
      (acc, filter) => [
        ...acc,
        ...filter.values.reduce<{ key: string; value: string }[]>(
          (acc, value) => [...acc, { key: `attributes.${filter.attribute}`, value }],
          [],
        ),
      ],
      [],
    )
    .map(param => `${param.key}=${encodeURIComponent(param.value)}`)
    .join("&");

const mapGroupsToQueryParams = (groups: string[]) => groups.map(group => `groups=${group}`).join("&");

export const backendService = {
  project: (projectId: string) => ({
    testSuites: {
      single: (testSuiteId: string) => ({
        get: () =>
          backend.get<ExistingServerSuite>(projectId + "/testsuite/" + testSuiteId).then(mapServerSuiteToClient),
        update: async (suite: ExistingSuite) =>
          mapServerSuiteToClient(await backend.put(projectId + "/testsuite/", mapClientSuiteToBackend(suite))),
      }),
      create: async (suite: SuiteDraft) =>
        mapServerSuiteToClient(await backend.post(projectId + "/testsuite/", mapNewClientSuiteToBackend(suite))),
    },
    attributes: {
      list: () => backend.get<ServerAttribute[]>(projectId + "/attribute").then(mapServerAttributesToClient),
    },
    testCases: {
      count: (filter: TestCasesFilter) => backend.get(projectId + "/testcase/count?" + qs.stringify(filter)),
      tree: (filters: AttributeFilterDraft[], groups: string[]) =>
        backend.get<RootTestCaseGroup>(
          projectId + "/testcase/tree?" + [mapFiltersToQueryParams(filters), mapGroupsToQueryParams(groups)].join("&"),
        ),
      list: (filters: AttributeFilterDraft[]) =>
        backend.get<ExistingTestCase[]>(projectId + "/testcase?" + mapFiltersToQueryParams(filters)),
    },
  }),
};

export type ServerAttributeFilterPayload = {
  readonly id: string;
  readonly attrValues: AttrValue[];
};
export type ServerAttributeFilterDraft = {
  readonly id: string | undefined;
  readonly attrValues: AttrValue[];
};
const mapNewClientFilterToBackend = (filter: AttributeFilterDraft): ServerAttributeFilterDraft => ({
  id: filter.attribute,
  attrValues: filter.values.map(value => ({ value })),
});

const copyMeta = (meta: Meta & WithID): Meta & WithID => ({
  createdBy: meta.createdBy,
  createdTime: meta.createdTime,
  lastModifiedBy: meta.lastModifiedBy,
  lastModifiedTime: meta.lastModifiedTime,
  deleted: meta.deleted,
  id: meta.id,
});

export type AttrValue = { value: string };
export type ServerAttributeFilter = DeletedMeta & TimeMeta & { id: string | undefined; attrValues: AttrValue[] };

export type ExistingServerAttributeFilter = WithID & DeletedMeta & TimeMeta & {};
export interface ServerSuite {
  readonly name: string;
  readonly filter: {
    readonly filters: (ServerAttributeFilter | ServerAttributeFilterDraft)[];
    readonly groups: string[];
    readonly notFields: Record<string, string[]>;
  };
}
export type ExistingServerSuite = ServerSuite &
  WithID &
  Meta & {
    readonly filter?: {
      readonly filters: ServerAttributeFilter[];
      readonly groups: string[];
      readonly notFields: Record<string, string[]>;
    };
  };
export type SaveExistingSuiteParams = ServerSuite &
  WithID &
  Meta & {
    readonly filter: {
      readonly filters: (ServerAttributeFilter | ServerAttributeFilterDraft)[];
    };
  };

export type NewServerSuite = {
  readonly name: string;
  readonly filter: {
    readonly filters: ServerAttributeFilterDraft[];
    readonly groups: string[];
    readonly notFields: Record<string, string[]>;
  };
};

export const mapNewSuiteToServer = (suite: SuiteDraft): NewServerSuite => ({
  name: suite.name,
  filter: {
    filters: suite.filters.map(mapNewClientFilterToBackend),
    groups: [],
    notFields: {},
  },
});
const isExistingAttributeFilter = (
  filter: ExistingAttributeFilter | AttributeFilterDraft,
): filter is ExistingAttributeFilter => !!(filter as ExistingAttributeFilter).createdTime;

const mapClientFilterToBackend = (
  filter: ExistingAttributeFilter | AttributeFilterDraft,
): ServerAttributeFilter | ServerAttributeFilterDraft => ({
  attrValues: filter.values.map(value => ({ value: value })),
  id: filter.attribute,
  ...(isExistingAttributeFilter(filter)
    ? {
        createdTime: filter.createdTime,
        lastModifiedTime: filter.lastModifiedTime,
        deleted: filter.deleted,
      }
    : {}),
});

const mapNewClientSuiteToBackend = (suite: SuiteDraft) => ({
  name: suite.name,
  filter: {
    filters: suite.filters.map(mapNewClientFilterToBackend),
    groups: [],
    notFields: {
      id: suite.excludedTestCases,
    },
  },
});

const mapClientSuiteToBackend = (suite: ExistingSuite): SaveExistingSuiteParams => ({
  ...copyMeta(suite),
  name: suite.name,
  filter: {
    filters: suite.filters.map(mapClientFilterToBackend),
    groups: suite.groups,
    notFields: {
      id: suite.excludedTestCases,
    },
  },
});

const mapServerFilterToClient = (filter: ServerAttributeFilter): ExistingAttributeFilter => ({
  attribute: filter.id!,
  values: filter.attrValues.map(value => value.value),
  createdTime: filter.createdTime,
  deleted: filter.deleted,
  lastModifiedTime: filter.lastModifiedTime,
});

const mapServerSuiteToClient = (suite: ExistingServerSuite): ExistingSuite => ({
  ...copyMeta(suite),
  name: suite.name,
  filters: (suite.filter?.filters ?? []).map(mapServerFilterToClient),
  groups: suite.filter?.groups ?? [],
  excludedTestCases: suite.filter?.notFields.id ?? [],
});

export default backend;
