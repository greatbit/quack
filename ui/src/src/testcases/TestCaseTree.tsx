import { atomFamily, selectorFamily, useRecoilState } from "recoil";

import List from "../components/testcase/List";

import { TestCaseListProps } from "./TestCaseList";
import TestCaseGroupComponent from "../components/testcase/TestCaseGroup";
import { ExclusionState, useSelection } from "./hooks";

import {
  AttributeFilterDraft,
  ExistingTestCase,
  getAllTestCases,
  listToBoolHash,
  RootTestCaseGroup,
  TestCaseGroup,
} from "../domain";
import TestCasesPanel from "./TestCasesPanel";
import { useQueryStringState } from "../lib/hooks";
import { backendService } from "../services/backend";
import TestCaseListItem from "../components/testcase/TestCaseListItem";

export type TestCaseTreeProps = TestCaseListProps & {
  groups: string[];
  exclusionState: ExclusionState;
};

export type TestCaseListSelectorParams = {
  projectID: string;
  filters: AttributeFilterDraft[];
};

export type TestCaseTreeSelectorParams = TestCaseListSelectorParams & {
  groups: string[];
};

const testCaseTreeAtom = atomFamily<RootTestCaseGroup | undefined, TestCaseTreeSelectorParams>({
  key: "test-case-tree-atom",
  default: undefined,
});

export const testCaseTreeSelector = selectorFamily<RootTestCaseGroup, TestCaseTreeSelectorParams>({
  key: "test-case-list-selector",
  get:
    ({ projectID, filters, groups }: TestCaseTreeSelectorParams) =>
    ({ get }) =>
      get(testCaseTreeAtom({ projectID, filters, groups })) ||
      backendService.project(projectID).testCases.tree(filters, groups),
  set:
    params =>
    ({ set }, value) =>
      set(testCaseTreeAtom(params), value),
});

export const useToggleGroupState = (exclusionState: ExclusionState) => (group: TestCaseGroup) => {
  const cases = getAllTestCases([group]).map(testCase => testCase.id);
  const exclusions = cases.map(id => exclusionState[0][id]);
  const hasExcluded = exclusions.some(Boolean);
  let value = false;
  if (!hasExcluded) {
    value = true;
  }
  exclusionState[1](listToBoolHash(cases, value));
};

const TestCaseTree = ({
  attributes,
  project,
  isTestCaseSelected,
  onToggleTestCase,
  filters,
  groups,
  exclusionState,
  disabled,
  suite,
}: TestCaseTreeProps) => {
  const [rootTestCaseGroup, setRootTestCaseGroop] = useRecoilState(
    testCaseTreeSelector({ projectID: project.id, filters, groups }),
  );
  const [selectedTestCaseID, setSelectedTestCaseID] = useQueryStringState("selected", undefined);
  const [isGroupOpen, toggleGroup] = useSelection();
  const toggleGroupState = useToggleGroupState(exclusionState);
  const handleTestCaseAdded = (testCase: ExistingTestCase) => {
    setRootTestCaseGroop({ ...rootTestCaseGroup, testCases: [testCase, ...rootTestCaseGroup.testCases] });
  };

  return (
    <TestCasesPanel
      project={project}
      attributes={attributes}
      selectedTestCaseID={selectedTestCaseID}
      onTestCaseAdded={handleTestCaseAdded}
      suite={suite}
    >
      <List>
        {rootTestCaseGroup.testCases.map(testCase => (
          <TestCaseListItem
            key={testCase.id}
            testCase={testCase}
            onClick={setSelectedTestCaseID}
            onCheckboxClick={onToggleTestCase}
            selected={selectedTestCaseID === testCase.id}
            checked={isTestCaseSelected(testCase.id)}
            level={-1}
          />
        ))}
        {rootTestCaseGroup.children?.map(testCaseGroup => (
          <TestCaseGroupComponent
            disabled={disabled}
            isTestCaseSelected={isTestCaseSelected}
            onChevronClick={toggleGroup}
            level={0}
            selectedTestCase={selectedTestCaseID}
            onTestCaseClick={setSelectedTestCaseID}
            testCaseGroup={testCaseGroup}
            key={testCaseGroup.id}
            onTestCaseCheckboxClick={onToggleTestCase}
            onCheckboxClick={toggleGroupState}
            isGroupOpen={isGroupOpen}
          />
        ))}
      </List>
    </TestCasesPanel>
  );
};

export default TestCaseTree;
