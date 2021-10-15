import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import qs, { IParseOptions } from "qs";

const useParsedQuery = (options?: Omit<IParseOptions, "ignoreQueryPrefix">) => {
  const location = useLocation();
  const queryString = location.search;
  return useMemo(() => qs.parse(queryString, { ignoreQueryPrefix: true, ...options }), [options, queryString]);
};

export const useQueryStringState = (name: string, initialValue?: string) => {
  const query = useParsedQuery();
  const history = useHistory();
  const set = useCallback(
    value => {
      history.push(
        qs.stringify(
          {
            ...query,
            [name]: value,
          },
          { addQueryPrefix: true },
        ),
      );
    },
    [history, name, query],
  );
  const value = (query[name] as string) || initialValue;
  return [value, set] as [typeof value, typeof set];
};

export const useJSONQueryStringState = <TValue>(name: string, initialValue: TValue) => {
  const [value, setValue] = useQueryStringState(name);
  const parsedFilters = useMemo(() => (value ? (JSON.parse(value) as TValue) : initialValue), [initialValue, value]);
  const updateFilters = useCallback(
    (filters: TValue) => {
      setValue(JSON.stringify(filters));
    },
    [setValue],
  );
  return [parsedFilters, updateFilters] as [typeof parsedFilters, typeof updateFilters];
};
