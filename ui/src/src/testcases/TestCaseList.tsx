import { useRecoilValue } from "recoil";
import { ExistingAttribute, FakeAttribute, AttributeFilterDraft } from "../domain";
import List from "../components/testcase/List";
import TestCaseListItem from "../components/testcase/TestCaseListItem";
import TestCasesPanel from "./TestCasesPanel";
import { useQueryStringState } from "../lib/hooks";
import { selectorFamily } from "recoil";
import { backendService } from "../services/backend";
import { WithProjectID } from "./testCasesScreen.data";

export type TestCaseListProps = {
  projectID: string;
  isTestCaseSelected: (id: string) => boolean;
  onToggleTestCase: (id: string) => void;
  filters: AttributeFilterDraft[];
  attributes: (ExistingAttribute | FakeAttribute)[];
  disabled?: boolean;
};

export type TestCaseTreeSelectorParams = TestCaseListSelectorParams & {
  groups: string[];
};

export type TestCaseListSelectorParams = {
  projectID: string;
  filters: AttributeFilterDraft[];
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

const TestCaseList = ({
  attributes,
  projectID,
  isTestCaseSelected,
  onToggleTestCase,
  filters,
  disabled,
}: TestCaseListProps) => {
  const testCases = useRecoilValue(testCaseListSelector({ projectID, filters }));
  const [selectedTestCaseID, setSelectedTestCaseID] = useQueryStringState("selected", testCases[0]?.id);
  return (
    <TestCasesPanel projectID={projectID} attributes={attributes} selectedTestCaseID={selectedTestCaseID}>
      <div>
        <List>
          {testCases.map(testCase => (
            <TestCaseListItem
              key={testCase.id}
              testCase={testCase}
              level={-1}
              checked={isTestCaseSelected(testCase.id)}
              onCheckboxClick={onToggleTestCase}
              selected={selectedTestCaseID === testCase.id}
              onClick={setSelectedTestCaseID}
              disabled={disabled}
            />
          ))}
        </List>
      </div>
    </TestCasesPanel>
  );
};

export default TestCaseList;
