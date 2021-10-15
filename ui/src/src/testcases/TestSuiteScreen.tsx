import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { backendService } from "../services/backend";
import { atomFamily, RecoilState, selectorFamily, useRecoilState, useRecoilValue } from "recoil";

import { FilterValue } from "../components/ui/Attribute";
import { ExistingAttributeFilter, ExistingSuite, listToBoolHash } from "../domain";

import { attributesSelector, useExistingProject } from "./testCasesScreen.data";

import { TestCasesScreenStateless } from "./TestCasesScreenStateless";
import SuiteHeader from "./SuiteHeader";

export type TestSuiteScreenProps = {
  projectID: string;
  suiteID: string;
};

export type SuiteState = {
  projectID: string;
  suiteID: string;
};
const suiteAtom = atomFamily<ExistingSuite | undefined, SuiteState>({
  key: "existing-suite",
  default: undefined,
});

const suiteSelector = selectorFamily<ExistingSuite, SuiteState>({
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

const useSaveSuite = (suiteState: RecoilState<ExistingSuite>, params: SuiteState) => {
  const [suite, setSuite] = useRecoilState(suiteState);
  const [isSaving, setIsSaving] = useState(false);
  const save = async (updatedSuite: Partial<ExistingSuite>) => {
    setIsSaving(true);
    try {
      const savedSuite = await backendService
        .project(params.projectID)
        .testSuites.single(params.suiteID)
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
  const project = useExistingProject(projectID)!;
  const attributes = useRecoilValue(attributesSelector({ projectID }));
  const suiteState = suiteSelector(selectorParams);

  const suite = useRecoilValue(suiteState);
  const [saveSuite, isSaving] = useSaveSuite(suiteState, selectorParams);
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
      suite={suite}
      disableTestCaseList={isSaving}
      beforeFilters={<SuiteHeader className="mb-5 ml-8 mr-8" name={suite.name} onChange={handleChangeSuiteName} />}
      disableFilters={isSaving}
      project={project}
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
