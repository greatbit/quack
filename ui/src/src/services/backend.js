export const getApiBaseUrl = url => (process.env.REACT_APP_BASE_API_URL || "/api/") + url;

const getOptions = options => ({
  ...options,
  credentials: "include",
});

const fetchInternal = (url, method, options) =>
  fetch(getApiBaseUrl(url), { ...getOptions(options), method }).then(response => response.json());
const getMutationOptions = body => ({
  body: JSON.stringify(body),
  headers: { "content-type": "application/json" },
});

const backend = {
  get: (url, options) => fetchInternal(url, "GET", options),
  post: (url, body) => fetchInternal(url, "POST", getMutationOptions(body)),
  delete: url => fetchInternal(url, "DELETE"),
  put: (url, body) => fetchInternal(url, "PUT", getMutationOptions(body)),
};

export default backend;
