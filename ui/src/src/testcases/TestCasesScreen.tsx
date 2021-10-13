import { FunctionComponent, useMemo, useState } from "react";
import { backendService } from "../services/backend";
import { useRecoilValue } from "recoil";
import { useJSONQueryStringState, useQueryStringState } from "../lib/hooks";
import { FilterValue } from "../components/ui/Attribute";
import { AttributeFilterDraft, SuiteDraft } from "../domain";
import SuiteDialog from "../components/suite/Dialog";
import { FormValues } from "../components/suite/Form";
import { useHistory } from "react-router";
import { ExclusionHash, useExclusion } from "./hooks";
import { attributesSelector, useExistingProject } from "./testCasesScreen.data";
import { TestCasesScreenStateless } from "./TestCasesScreenStateless";
import { SuiteHeaderText } from "./SuiteHeader";

export type TestCasesScreenProps = {
  projectID: string;
};

const useCreateSuite = (
  projectID: string,
  filters: AttributeFilterDraft[],
  groups: string[],
  excludedTestCases: string[],
) => {
  const history = useHistory();
  return async (values: FormValues) => {
    const suite = await backendService
      .project(projectID)
      .testSuites.create({ filters, excludedTestCases, name: values.name, groups });
    history.push(`/${projectID}/testsuites/${suite.id}`);
  };
};

const TextCasesScreen: FunctionComponent<TestCasesScreenProps> = ({ projectID }) => {
  const attributes = useRecoilValue(attributesSelector({ projectID }));
  const project = useExistingProject(projectID)!;
  const [filters, handleChangeFilters] = useJSONQueryStringState<FilterValue[]>("filters", []);
  const [groups, handleChangeGroups] = useJSONQueryStringState<string[]>("groups", []);
  const [showSaveDialog, setShowSaveDialog] = useQueryStringState("save");
  const exclusionState = useState<ExclusionHash>({});
  const [isTestCaseSelected, toggleTestCase] = useExclusion(exclusionState);
  const saveSuite = useCreateSuite(projectID, filters!, groups!, Object.keys(exclusionState[0]));
  const excludedTestCaseIDs = useMemo(() => Object.keys(exclusionState[0]), [exclusionState]);
  const draft: SuiteDraft = {
    filters,
    name: "",
    groups,
    excludedTestCases: excludedTestCaseIDs,
  };
  return (
    <>
      {showSaveDialog === "true" && (
        <SuiteDialog initialValues={{ name: "" }} onSubmit={saveSuite} onCancel={() => setShowSaveDialog(undefined)} />
      )}
      <TestCasesScreenStateless
        beforeFilters={<SuiteHeaderText className="mb-5 ml-8 mr-8">Test cases</SuiteHeaderText>}
        project={project}
        filters={filters}
        attributes={attributes}
        exclusionState={exclusionState}
        groups={groups}
        isTestCaseSelected={isTestCaseSelected}
        onChangeFilters={handleChangeFilters}
        onChangeGroups={handleChangeGroups}
        onToggleTestCase={toggleTestCase}
        showSaveSuite
        onSaveSuiteClick={() => setShowSaveDialog("true")}
        suite={draft}
      />
    </>
  );
};

export default TextCasesScreen;
