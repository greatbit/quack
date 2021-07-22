export const getApiBaseUrl = url => (process.env.REACT_APP_BASE_API_URL || "/api/") + url;

const getOptions = options => ({
  ...options,
  credentials: "include",
});

const fetchInternal = (url, method, options) =>
  fetch(getApiBaseUrl(url), { ...getOptions(options), method }).then(response => response.json());

const backend = {
  get: (url, options) => fetchInternal(url, "GET", options),
  post: (url, options) => fetchInternal(url, "POST", options),
  delete: (url, options) => fetchInternal(url, "DELETE", options),
  put: (url, options) => fetchInternal(url, "PUT", options),
};

export default backend;
