import { listToBoolHash } from "../domain";
import { useCallback, useState } from "react";

export const useSelection = (initialState: string[] = []) => {
  const [checked, setChecked] = useState(() => listToBoolHash(initialState));
  const toggle = (id: string) => {
    setChecked({ ...checked, [id]: !checked[id] });
  };
  const isChecked = (id: string) => checked[id];
  return [isChecked, toggle, checked] as [typeof isChecked, typeof toggle, typeof checked];
};
export type State<T> = [T, (newState: T) => void];
export type ExclusionHash = Record<string, boolean>;
export type ExclusionState = State<ExclusionHash>;
export const useExclusion = ([excluded, setExcluded]: ExclusionState) => {
  const toggle = useCallback(
    (id: string) => {
      setExcluded({ ...excluded, [id]: !excluded[id] });
    },
    [excluded, setExcluded],
  );
  const isSelected = useCallback((id: string) => !excluded[id], [excluded]);
  return [isSelected, toggle] as [typeof isSelected, typeof toggle];
};
