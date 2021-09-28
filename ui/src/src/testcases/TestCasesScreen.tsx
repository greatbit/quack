import { FunctionComponent, useState } from "react";
import { backendService } from "../services/backend";
import { useRecoilValue } from "recoil";
import { useJSONQueryStringState, useQueryStringState } from "../lib/hooks";
import { FilterValue } from "../components/ui/Filter";
import { AttributeFilterDraft } from "../domain";
import SuiteDialog from "../components/suite/Dialog";
import { FormValues } from "../components/suite/Form";
import { useHistory } from "react-router";
import { ExclusionHash, useExclusion } from "./hooks";
import { attributesSelector } from "./testCasesScreen.data";
import { TestCasesScreenStateless } from "./TestCasesScreenStateless";
import { SuiteHeaderText } from "./SuiteHeader";

export type TestCasesScreenProps = {
  projectID: string;
};

const useCreateSuite = (projectID: string, filters: AttributeFilterDraft[], excludedTestCases: string[]) => {
  const history = useHistory();
  return async (values: FormValues) => {
    const suite = await backendService
      .project(projectID)
      .testSuites.create({ filters, excludedTestCases, name: values.name });
    history.push(`/${projectID}/testsuites/${suite.id}`);
  };
};

const TextCasesScreen: FunctionComponent<TestCasesScreenProps> = ({ projectID }) => {
  const attributes = useRecoilValue(attributesSelector({ projectID }));
  const [filters, handleChangeFilters] = useJSONQueryStringState<FilterValue[]>("filters", []);
  const [groups, handleChangeGroups] = useJSONQueryStringState<string[]>("groups", []);
  const [showSaveDialog, setShowSaveDialog] = useQueryStringState("save");
  const exclusionState = useState<ExclusionHash>({});
  const [isTestCaseSelected, toggleTestCase] = useExclusion(exclusionState);
  const saveSuite = useCreateSuite(projectID, filters!, groups!);

  return (
    <>
      {showSaveDialog === "true" && (
        <SuiteDialog initialValues={{ name: "" }} onSubmit={saveSuite} onCancel={() => setShowSaveDialog(undefined)} />
      )}
      <TestCasesScreenStateless
        beforeFilters={<SuiteHeaderText className="mr-8 mb-5 ml-8">Test cases</SuiteHeaderText>}
        projectID={projectID}
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
      />
    </>
  );
};

export default TextCasesScreen;
