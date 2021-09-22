import { atom, selectorFamily } from "recoil";
import { AttributeFilterDraft, flattenGroups, getAllTestCases, GroupState, listToBoolHash } from "../domain";
import listToLookup from "../lib/listToLookup";
import { backendService } from "../services/backend";

export type TestCaseTreeSelectorParams = TestCaseListSelectorParams & {
  groups: string[];
};

export type TestCaseListSelectorParams = {
  projectID: string;
  filters: AttributeFilterDraft[];
};
export type WithProjectID = {
  projectID: string;
};

export const attributesSelector = selectorFamily({
  key: "project-attributes",
  get:
    ({ projectID }: WithProjectID) =>
    () =>
      backendService.project(projectID).attributes.list(),
});
export const testCaseListSelector = selectorFamily({
  key: "test-case-list-selector",
  get:
    ({ projectID, filters }: TestCaseListSelectorParams) =>
    () =>
      backendService.project(projectID).testCases.list(filters),
});

export const testCaseTreeSelector = selectorFamily({
  key: "test-case-list-selector",
  get:
    ({ projectID, filters, groups }: TestCaseTreeSelectorParams) =>
    () =>
      backendService.project(projectID).testCases.tree(filters, groups),
});

const testCaseGroupLookupSelector = selectorFamily({
  key: "test-case-group-lookup-selector",
  get:
    (params: TestCaseTreeSelectorParams) =>
    ({ get }) =>
      listToLookup(flattenGroups(get(testCaseTreeSelector(params)).children ?? [])),
});

export type GroupTestCasesSelectorParams = TestCaseTreeSelectorParams & {
  groupID: string;
};

const groupTestCasesSelector = selectorFamily({
  key: "group-test-cases-selector",
  get:
    ({ groupID, ...other }: GroupTestCasesSelectorParams) =>
    ({ get }) => {
      const lookup = get(testCaseGroupLookupSelector(other));
      const group = lookup[groupID];
      const testCases = getAllTestCases([group]).map(testCase => testCase.id);
      return testCases;
    },
});

export const exclusionAtom = atom<Record<string, boolean>>({ key: "exlusion", default: {} });

export const groupStateSelector = selectorFamily<GroupState, GroupTestCasesSelectorParams>({
  key: "group-state-selector",
  get:
    params =>
    ({ get }) => {
      const testCases = get(groupTestCasesSelector(params));
      const excluded = get(exclusionAtom);
      const haveSelected = testCases.find(id => !excluded[id]);
      const haveNotSelected = testCases.find(id => !!excluded[id]);
      if (haveSelected && haveNotSelected) {
        return GroupState.Indeterminate;
      } else if (!haveSelected) {
        return GroupState.Unselected;
      }
      return GroupState.Selected;
    },
  set:
    params =>
    ({ get, set }, newValue) => {
      const testCases = get(groupTestCasesSelector(params));
      set(exclusionAtom, { ...get(exclusionAtom), ...listToBoolHash(testCases, newValue === GroupState.Unselected) });
    },
});
