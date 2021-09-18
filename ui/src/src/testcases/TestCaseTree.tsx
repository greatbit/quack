import { useRecoilCallback, useRecoilValue } from "recoil";

import List from "../components/testcase/List";
import { useQueryStringState } from "../lib/hooks";
import { TestCaseListProps } from "./TestCaseList";
import TestCaseGroupComponent from "../components/testcase/TestCaseGroup";
import { useSelection } from "./hooks";

import { groupStateSelector, testCaseTreeSelector, TestCaseTreeSelectorParams } from "./testCasesScreen.data";
import { GroupState } from "../domain";
import TestCasesPanel from "./TestCasesPanel";

export type TestCaseTreeProps = TestCaseListProps & {
  groups: string[];
  excludedTestCases: Record<string, boolean>;
  setExcludedTestCases: (excludedTestCases: Record<string, boolean>) => void;
};

const useGroupState = ({ projectID, filters, groups }: TestCaseTreeSelectorParams) => {
  const getGroupState = useRecoilCallback(
    ({ snapshot }) =>
      (groupID: string) =>
        snapshot.getLoadable(groupStateSelector({ projectID, filters, groups, groupID })).getValue(),
    [projectID, filters, groups],
  );

  const toggleGroupState = useRecoilCallback(
    ({ set }) =>
      (groupID: string) => {
        set(
          groupStateSelector({ projectID, filters, groups, groupID }),
          oldValue =>
            ({
              [GroupState.Selected]: GroupState.Unselected,
              [GroupState.Unselected]: GroupState.Selected,
              [GroupState.Indeterminate]: GroupState.Selected,
            }[oldValue]),
        );
      },
    [],
  );
  return [getGroupState, toggleGroupState] as [typeof getGroupState, typeof toggleGroupState];
};

const TestCaseTree = ({
  attributes,
  projectID,
  isTestCaseSelected,
  onToggleTestCase,
  filters,
  groups,
}: TestCaseTreeProps) => {
  const testCases = useRecoilValue(testCaseTreeSelector({ projectID, filters, groups }));
  const [selectedTestCaseID, setSelectedTestCaseID] = useQueryStringState("selected", undefined);
  const [isGroupOpen, toggleGroup] = useSelection([]);
  const [getGroupState, toggleGroupState] = useGroupState({ projectID, filters, groups });
  return (
    <TestCasesPanel projectID={projectID} attributes={attributes} selectedTestCaseID={selectedTestCaseID}>
      <List>
        {testCases.children.map(testCaseGroup => (
          <TestCaseGroupComponent
            isTestCaseSelected={isTestCaseSelected}
            onChevronClick={toggleGroup}
            level={0}
            selectedTestCase={selectedTestCaseID}
            onTestCaseClick={setSelectedTestCaseID}
            testCaseGroup={testCaseGroup}
            key={testCaseGroup.id}
            onTestCaseCheckboxClick={onToggleTestCase}
            getGroupState={getGroupState}
            onCheckboxClick={toggleGroupState}
            isGroupOpen={isGroupOpen}
          />
        ))}
        {/* {testCases.map(testCase => (
          <TestCaseListItem
            testCase={testCase}
            level={-1}
            checked={isTestCaseSelected(testCase.id)}
            onCheckboxClick={onToggleTestCase}
            selected={selectedTestCaseID === testCase.id}
            onClick={setSelectedTestCaseID}
          />
        ))} */}
      </List>
    </TestCasesPanel>
  );
};

export default TestCaseTree;
