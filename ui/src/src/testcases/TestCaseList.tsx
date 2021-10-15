import { atomFamily, useRecoilState, useRecoilValue } from "recoil";
import {
  ExistingAttribute,
  FakeAttribute,
  AttributeFilterDraft,
  ExistingTestCase,
  ExistingProject,
  ExistingSuite,
  SuiteDraft,
} from "../domain";
import List from "../components/testcase/List";
import TestCaseListItem from "../components/testcase/TestCaseListItem";
import TestCasesPanel from "./TestCasesPanel";
import { useQueryStringState } from "../lib/hooks";
import { selectorFamily } from "recoil";
import { backendService } from "../services/backend";
import { WithProjectID } from "./testCasesScreen.data";
import Button, { linkNeutralClasses } from "../components/ui/Button";
import { useState } from "react";
import clsx from "clsx";

export type TestCaseListProps = {
  isTestCaseSelected: (id: string) => boolean;
  onToggleTestCase: (id: string) => void;
  filters: AttributeFilterDraft[];
  attributes: (ExistingAttribute | FakeAttribute)[];
  disabled?: boolean;
  project: ExistingProject;
  suite: ExistingSuite | SuiteDraft;
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

const testCaseAtom = atomFamily<ExistingTestCase[] | undefined, TestCaseListSelectorParams>({
  key: "test-case-atom",
  default: undefined,
});
export const testCaseListSelector = selectorFamily<ExistingTestCase[], TestCaseListSelectorParams>({
  key: "test-case-list-selector",
  get:
    ({ projectID, filters }) =>
    ({ get }) =>
      get(testCaseAtom({ projectID, filters })) || backendService.project(projectID).testCases.list(filters),
  set:
    ({ projectID, filters }) =>
    ({ set }, value) =>
      set(testCaseAtom({ projectID, filters }), value),
});

export const testCaseCountSelector = selectorFamily({
  key: "test-case-count-selector",
  get:
    ({ projectID, filters }: TestCaseListSelectorParams) =>
    () =>
      backendService.project(projectID).testCases.count(filters),
});

const TestCaseList = ({
  attributes,
  project,
  isTestCaseSelected,
  onToggleTestCase,
  filters,
  disabled,
  suite,
}: TestCaseListProps) => {
  const projectID = project.id;
  const [loadingMore, setLoadingMore] = useState(false);
  const [testCases, setTestCases] = useRecoilState(testCaseListSelector({ projectID, filters }));

  const handleLoadMoreClick = async () => {
    setLoadingMore(true);
    try {
      setTestCases([
        ...testCases,
        ...(await backendService.project(projectID).testCases.list(filters, testCases.length)),
      ]);
    } finally {
      setLoadingMore(false);
    }
  };
  const testCaseCount = useRecoilValue(testCaseCountSelector({ projectID, filters }));

  const [selectedTestCaseID, setSelectedTestCaseID] = useQueryStringState("selected", testCases[0]?.id);
  const handleAddTestCase = (testCase: ExistingTestCase) => {
    setTestCases([testCase, ...testCases]);
  };
  return (
    <TestCasesPanel
      attributes={attributes}
      selectedTestCaseID={selectedTestCaseID}
      onTestCaseAdded={handleAddTestCase}
      project={project}
      suite={suite}
    >
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
        {testCases.length < testCaseCount && (
          <Button.Link
            className={clsx("flex justify-center text-primary text-base w-full mt-3 mb-3", linkNeutralClasses)}
            disabled={loadingMore}
            onClick={handleLoadMoreClick}
          >
            Load more
          </Button.Link>
        )}
      </div>
    </TestCasesPanel>
  );
};

export default TestCaseList;
