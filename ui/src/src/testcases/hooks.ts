import {
  flattenGroup,
  flattenGroups,
  getAllTestCases,
  getFullySetHash,
  getGroupLookup,
  listToBoolHash,
  TestCaseGroup,
} from "../domain";
import { useCallback, useMemo, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

export const useSelection = (initialState: string[]) => {
  const [checked, setChecked] = useState(() => listToBoolHash(initialState));
  const toggle = (id: string) => {
    setChecked({ ...checked, [id]: !checked[id] });
  };
  const isChecked = (id: string) => checked[id];
  return [isChecked, toggle, checked] as [typeof isChecked, typeof toggle, typeof checked];
};

export const useExclusion = (atom: RecoilState<Record<string, boolean>>) => {
  const [excluded, setExcluded] = useRecoilState(atom);
  const toggle = useCallback(
    (id: string) => {
      setExcluded({ ...excluded, [id]: !excluded[id] });
    },
    [excluded, setExcluded],
  );
  const isSelected = useCallback((id: string) => !excluded[id], [excluded]);
  return [isSelected, toggle, excluded, setExcluded] as [
    typeof isSelected,
    typeof toggle,
    typeof excluded,
    typeof setExcluded,
  ];
};

export const useTreeExclusion = (
  groups: TestCaseGroup[],
  excludedTestCases: Record<string, boolean>,
  setExcludedTestCases: (testCases: Record<string, boolean>) => void,
) => {
  const flatGroups = useMemo(() => flattenGroups(groups), [groups]);
  const groupLookup = useMemo(() => getGroupLookup(flatGroups), [flatGroups]);

  const [excludedGroups, setExcludedGroups] = useState<Record<string, boolean>>(() => ({}));

  const toggleGroup = useCallback(
    (id: string) => {
      const selected = !excludedGroups[id];
      setExcludedGroups({ ...excludedGroups, ...getFullySetHash(flattenGroup(groupLookup[id]), selected) });
      setExcludedTestCases({
        ...excludedTestCases,
        ...listToBoolHash(
          getAllTestCases([groupLookup[id]]).map(testCase => testCase.id),
          selected,
        ),
      });
    },
    [excludedGroups, excludedTestCases, groupLookup, setExcludedTestCases],
  );

  const isGroupSelected = useCallback((id: string): boolean => !excludedGroups[id], [excludedGroups]);
  return [isGroupSelected, toggleGroup, excludedGroups] as [
    typeof isGroupSelected,
    typeof toggleGroup,
    typeof excludedGroups,
  ];
};
