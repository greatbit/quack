import { FunctionComponent, Suspense } from "react";
import { backendService } from "../services/backend";
import { atomFamily, selectorFamily, useRecoilState, useRecoilValue } from "recoil";

import TestCasesFilter from "./TestCasesFilters";
import { FilterValue } from "../components/ui/Filter";
import { ExistingAttributeFilter, ExistingSuite, listToBoolHash } from "../domain";

import TestCaseList from "./TestCaseList";
import TestCaseTree from "./TestCaseTree";
import { useExclusion } from "./hooks";
import { attributesSelector, WithProjectID } from "./testCasesScreen.data";
import { Loading } from "../components/ui";

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

const useSaveSuite = (params: SuiteSelectorParams) => {
  const [suite, setSuite] = useRecoilState(suiteSelector(params));
  return async (updatedSuite: Partial<ExistingSuite>) => {
    console.info("updated", updatedSuite);
    const savedSuite = await backendService
      .project(params.projectID)
      .testSuites.single(params.suiteID)
      .update({ ...suite, ...updatedSuite });
    setSuite(savedSuite);
  };
};

const exclusionSelector = selectorFamily<Record<string, boolean>, SuiteSelectorParams>({
  key: "exclusionsSelector",
  get:
    params =>
    ({ get }) => {
      const suite = get(suiteSelector(params));
      return listToBoolHash(suite.excludedTestCases);
    },
  set:
    params =>
    ({ get, set }, newValue) => {
      const selector = suiteSelector(params);
      set(selector, {
        ...get(selector),
        excludedTestCases: Object.keys(newValue).filter(key => (newValue as Record<string, boolean>)[key]),
      });
    },
});

const TestSuiteScreen: FunctionComponent<TestSuiteScreenProps> = ({ projectID, suiteID }) => {
  const selectorParams = { projectID, suiteID };
  const attributes = useRecoilValue(attributesSelector({ projectID }));

  const [isTestCaseSelected, , excludedTestCases] = useExclusion(exclusionSelector(selectorParams));

  const suite = useRecoilValue(suiteSelector(selectorParams));
  const saveSuite = useSaveSuite(selectorParams);
  const setExcludedTestCasesHandler = async (exclusion: Record<string, boolean>) => {
    await saveSuite({ ...suite, excludedTestCases: Object.keys(exclusion).filter(key => !!exclusion[key]) });
  };
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

  const sharedListProps = {
    projectID,
    filters: suite.filters,
    isTestCaseSelected,
    onToggleTestCase: handleToggleTestCase,
    attributes,
  };

  return (
    <div className="tailwind" style={{ marginLeft: "-15px", marginRight: "-15px" }}>
      <div className="bg-neutral-fade6 pt-8 pb-8">
        <TestCasesFilter
          projectAttributes={attributes}
          groups={suite.groups!}
          filters={suite.filters!}
          onChangeFilters={handleChangeFilters}
          onChangeGroups={handleChangeGroups}
        />

        <Suspense
          fallback={
            <div className="flex justify-center mt-8">
              <Loading />
            </div>
          }
        >
          {suite.groups.length === 0 ? (
            <TestCaseList {...sharedListProps} />
          ) : (
            <TestCaseTree
              {...sharedListProps}
              groups={suite.groups}
              excludedTestCases={excludedTestCases}
              setExcludedTestCases={setExcludedTestCasesHandler}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default TestSuiteScreen;
