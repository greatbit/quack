export const getApiBaseUrl = url => (process.env.REACT_APP_BASE_API_URL || "/api/") + url;

const getOptions = options => ({
  ...options,
  credentials: "include",
});

const fetchInternal = (url, method, options) => fetch(getApiBaseUrl(url), { ...getOptions(options), method });
const fetchJSON = (url, method, options) => fetchInternal(url, method, options).then(response => response.json());
const getMutationOptions = body => ({
  body: JSON.stringify(body),
  headers: { "content-type": "application/json" },
});

const backend = {
  get: (url, options) => fetchJSON(url, "GET", options),
  post: (url, body) => fetchJSON(url, "POST", getMutationOptions(body)),
  delete: url => fetchInternal(url, "DELETE"),
  put: (url, body) => fetchJSON(url, "PUT", getMutationOptions(body)),
};

export default backend;
