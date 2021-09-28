import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { backendService } from "../services/backend";
import { atomFamily, RecoilState, selectorFamily, useRecoilState, useRecoilValue } from "recoil";

import { FilterValue } from "../components/ui/Filter";
import { ExistingAttributeFilter, ExistingSuite, listToBoolHash } from "../domain";

import { attributesSelector, WithProjectID } from "./testCasesScreen.data";

import { TestCasesScreenStateless } from "./TestCasesScreenStateless";
import SuiteHeader from "./SuiteHeader";

export type TestSuiteScreenProps = {
  projectID: string;
  suiteID: string;
};

type SuiteSelectorParams = WithProjectID & { suiteID: string };

const suiteAtom = atomFamily<ExistingSuite | undefined, SuiteSelectorParams>({
  key: "existing-suite",
  default: undefined,
});

const suiteSelector = selectorFamily<ExistingSuite, SuiteSelectorParams>({
  key: "suite",
  get:
    ({ projectID, suiteID }) =>
    ({ get }) =>
      get(suiteAtom({ projectID, suiteID })) || backendService.project(projectID).testSuites.single(suiteID).get(),
  set:
    params =>
    ({ set }, value) => {
      set(suiteAtom(params), value);
    },
});

const useSaveSuite = (suiteState: RecoilState<ExistingSuite>, projectID: string, suiteID: string) => {
  const [suite, setSuite] = useRecoilState(suiteState);
  const [isSaving, setIsSaving] = useState(false);
  const save = async (updatedSuite: Partial<ExistingSuite>) => {
    setIsSaving(true);
    try {
      const savedSuite = await backendService
        .project(projectID)
        .testSuites.single(suiteID)
        .update({ ...suite, ...updatedSuite });
      setSuite(savedSuite);
    } finally {
      setIsSaving(false);
    }
  };
  return [save, isSaving] as [typeof save, typeof isSaving];
};

const TestSuiteScreen: FunctionComponent<TestSuiteScreenProps> = ({ projectID, suiteID }) => {
  const selectorParams = { projectID, suiteID };
  const attributes = useRecoilValue(attributesSelector({ projectID }));
  const suiteState = suiteSelector(selectorParams);

  const suite = useRecoilValue(suiteState);
  const [saveSuite, isSaving] = useSaveSuite(suiteState, projectID, suiteID);
  const exclusionHash = useMemo(() => listToBoolHash(suite.excludedTestCases), [suite.excludedTestCases]);
  const isTestCaseSelected = (id: string) => !exclusionHash[id];
  const setExcludedTestCasesHandler = useCallback(
    async (exclusion: Record<string, boolean>) => {
      await saveSuite({ ...suite, excludedTestCases: Object.keys(exclusion).filter(key => !!exclusion[key]) });
    },
    [saveSuite, suite],
  );
  const exclusionState = useMemo(
    () => [exclusionHash, setExcludedTestCasesHandler] as [typeof exclusionHash, typeof setExcludedTestCasesHandler],
    [exclusionHash, setExcludedTestCasesHandler],
  );
  const handleToggleTestCase = async (id: string) => {
    await saveSuite({
      ...suite,
      excludedTestCases: suite.excludedTestCases.includes(id)
        ? suite.excludedTestCases.filter(item => item !== id)
        : [...suite.excludedTestCases, id],
    });
  };

  const handleChangeFilters = async (filters: (ExistingAttributeFilter | FilterValue)[]) => {
    saveSuite({ ...suite, filters });
  };

  const handleChangeGroups = async (groups: string[]) => {
    saveSuite({ ...suite, groups });
  };
  const handleChangeSuiteName = (name: string) => {
    saveSuite({ ...suite, name });
  };
  return (
    <TestCasesScreenStateless
      disableTestCaseList={isSaving}
      beforeFilters={<SuiteHeader className="mr-8 mb-5 ml-8" name={suite.name} onChange={handleChangeSuiteName} />}
      disableFilters={isSaving}
      projectID={projectID}
      filters={suite.filters}
      attributes={attributes}
      exclusionState={exclusionState}
      groups={suite.groups}
      isTestCaseSelected={isTestCaseSelected}
      onChangeFilters={handleChangeFilters}
      onChangeGroups={handleChangeGroups}
      onToggleTestCase={handleToggleTestCase}
    />
  );
};

export default TestSuiteScreen;
