import qs from "qs";
import * as Utils from "../common/Utils";
import { Attribute, Suite } from "../domain";
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
const mapServerAttributesToClient = (response: Attribute[]) => {
  const attributes = response.sort((a, b) => (a.name || "").localeCompare(b.name));
  attributes.unshift({
    id: "broken",
    name: "Broken",
    values: [
      { id: "true", name: "True" },
      { id: "false", name: "False" },
    ],
  });
  return attributes;
};

export const backendService = {
  project: (projectId: string) => ({
    testSuites: {
      single: (testSuiteId: string) => ({
        get: () => backend.get(projectId + "/testsuite/" + testSuiteId),
      }),
      create: (suite: Suite) => backend.post(projectId + "/testsuite/", suite),
    },
    attributes: {
      list: () => backend.get<Attribute[]>(projectId + "/attribute").then(mapServerAttributesToClient),
    },
    testcases: {
      count: (filter: TestCasesFilter) => backend.get(projectId + "/testcase/count?" + qs.stringify(filter)),
      tree: (filter: TestCasesFilter) => backend.get(projectId + "/testcase/tree?" + qs.stringify(filter)),
      list: (filter: TestCasesFilter) => backend.get(projectId + "/testcase?" + qs.stringify(filter)),
    },
  }),
};

export default backend;
