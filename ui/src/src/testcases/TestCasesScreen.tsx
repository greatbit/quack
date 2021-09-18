import { FunctionComponent, Suspense } from "react";
import { backendService } from "../services/backend";
import { selectorFamily, useRecoilValue } from "recoil";
import { useJSONQueryStringState, useQueryStringState } from "../lib/hooks";
import TestCasesFilter from "./TestCasesFilters";
import { FilterValue } from "../components/ui/Filter";
import { AttributeFilterDraft } from "../domain";
import SuiteDialog from "../components/suite/Dialog";
import { FormValues } from "../components/suite/Form";
import { useHistory } from "react-router";
import TestCaseList from "./TestCaseList";
import TestCaseTree from "./TestCaseTree";
import { useExclusion } from "./hooks";
import { exclusionAtom } from "./testCasesScreen.data";
import { Loading } from "../components/ui";

export type TestCasesScreenProps = {
  projectID: string;
};

export type WithProjectID = {
  projectID: string;
};

const attributesSelector = selectorFamily({
  key: "project-attributes",
  get:
    ({ projectID }: WithProjectID) =>
    () =>
      backendService.project(projectID).attributes.list(),
});

const useSaveSuite = (projectID: string, filters: AttributeFilterDraft[], excludedTestCases: string[]) => {
  const history = useHistory();
  return async (values: FormValues) => {
    const suite = await backendService
      .project(projectID)
      .testSuites.create({ filters, excludedTestCases, name: values.name });
    history.push(`/${projectID}/suites/${suite.id}`);
  };
};

const TextCasesScreen: FunctionComponent<TestCasesScreenProps> = ({ projectID }) => {
  const attributes = useRecoilValue(attributesSelector({ projectID }));
  const [filters, handleChangeFilters] = useJSONQueryStringState<FilterValue[]>("filters", []);
  const [groups, handleChangeGroups] = useJSONQueryStringState<string[]>("groups", []);
  const [showSaveDialog, setShowSaveDialog] = useQueryStringState("save");
  const [isTestCaseSelected, toggleTestCase, excludedTestCases, setExcludedTestCases] = useExclusion(exclusionAtom);
  const saveSuite = useSaveSuite(projectID, filters!, groups!);

  const sharedListProps = {
    projectID,
    filters,
    isTestCaseSelected,
    onToggleTestCase: toggleTestCase,
    attributes,
  };

  return (
    <div className="tailwind" style={{ marginLeft: "-15px", marginRight: "-15px" }}>
      <div className="bg-neutral-fade6 pt-8 pb-8">
        {showSaveDialog === "true" && (
          <SuiteDialog
            initialValues={{ name: "" }}
            onSubmit={saveSuite}
            onCancel={() => setShowSaveDialog(undefined)}
          />
        )}
        <TestCasesFilter
          projectAttributes={attributes}
          groups={groups!}
          filters={filters!}
          onChangeFilters={handleChangeFilters}
          onChangeGroups={handleChangeGroups}
          showSave
          onSaveSuiteClick={() => setShowSaveDialog("true")}
        />

        <Suspense
          fallback={
            <div className="flex justify-center mt-8">
              <Loading />
            </div>
          }
        >
          {groups.length === 0 ? (
            <TestCaseList {...sharedListProps} />
          ) : (
            <TestCaseTree
              {...sharedListProps}
              groups={groups}
              excludedTestCases={excludedTestCases}
              setExcludedTestCases={setExcludedTestCases}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default TextCasesScreen;
