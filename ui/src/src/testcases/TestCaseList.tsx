import { useRecoilValue } from "recoil";
import { AttributeFilterDraft, ExistingAttribute, FakeAttribute } from "../domain";

import List from "../components/testcase/List";
import TestCaseListItem from "../components/testcase/TestCaseListItem";
import { useQueryStringState } from "../lib/hooks";
import { testCaseListSelector } from "./testCasesScreen.data";
import TestCasesPanel from "./TestCasesPanel";

export type TestCaseListProps = {
  projectID: string;
  isTestCaseSelected: (id: string) => boolean;
  onToggleTestCase: (id: string) => void;
  filters: AttributeFilterDraft[];
  attributes: (ExistingAttribute | FakeAttribute)[];
};

const TestCaseList = ({ attributes, projectID, isTestCaseSelected, onToggleTestCase, filters }: TestCaseListProps) => {
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
            />
          ))}
        </List>
      </div>
    </TestCasesPanel>
  );
};

export default TestCaseList;
