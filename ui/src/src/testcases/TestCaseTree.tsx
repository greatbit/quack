import { selectorFamily, useRecoilValue } from "recoil";

import List from "../components/testcase/List";

import { TestCaseListProps } from "./TestCaseList";
import TestCaseGroupComponent from "../components/testcase/TestCaseGroup";
import { ExclusionState, useSelection } from "./hooks";

import { AttributeFilterDraft, getAllTestCases, listToBoolHash, TestCaseGroup } from "../domain";
import TestCasesPanel from "./TestCasesPanel";
import { useQueryStringState } from "../lib/hooks";
import { backendService } from "../services/backend";

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
export const testCaseTreeSelector = selectorFamily({
  key: "test-case-list-selector",
  get:
    ({ projectID, filters, groups }: TestCaseTreeSelectorParams) =>
    () =>
      backendService.project(projectID).testCases.tree(filters, groups),
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
  projectID,
  isTestCaseSelected,
  onToggleTestCase,
  filters,
  groups,
  exclusionState,
  disabled,
}: TestCaseTreeProps) => {
  const testCases = useRecoilValue(testCaseTreeSelector({ projectID, filters, groups }));
  const [selectedTestCaseID, setSelectedTestCaseID] = useQueryStringState("selected", undefined);
  const [isGroupOpen, toggleGroup] = useSelection();
  const toggleGroupState = useToggleGroupState(exclusionState);
  return (
    <TestCasesPanel projectID={projectID} attributes={attributes} selectedTestCaseID={selectedTestCaseID}>
      <List>
        {testCases.children?.map(testCaseGroup => (
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
