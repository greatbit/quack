import { ReactNode, Suspense } from "react";
import { Loading } from "../components/ui";
import {
  AttributeFilterDraft,
  ExistingAttribute,
  ExistingAttributeFilter,
  ExistingProject,
  ExistingSuite,
  FakeAttribute,
  SuiteDraft,
} from "../domain";
import { ExclusionState } from "./hooks";
import TestCaseList from "./TestCaseList";
import TestCasesFilter from "./TestCasesFilters";
import TestCaseTree from "./TestCaseTree";

export type TestCasesScreenStatelessProps = {
  beforeFilters?: ReactNode;
  disableTestCaseList?: boolean;
  disableFilters?: boolean;
  attributes: (ExistingAttribute | FakeAttribute)[];
  filters: (AttributeFilterDraft | ExistingAttributeFilter)[];
  groups: string[];
  onChangeFilters: (value: (AttributeFilterDraft | ExistingAttributeFilter)[]) => void;
  onChangeGroups: (value: string[]) => void;
  exclusionState: ExclusionState;
  project: ExistingProject;
  isTestCaseSelected: (id: string) => boolean;
  onToggleTestCase: (id: string) => void;
  showSaveSuite?: boolean;
  onSaveSuiteClick?: () => void;
  suite: ExistingSuite | SuiteDraft;
};

export const TestCasesScreenStateless = ({
  attributes,
  groups,
  filters,
  onChangeFilters,
  onChangeGroups,
  exclusionState,
  beforeFilters,
  disableFilters,
  showSaveSuite,
  onSaveSuiteClick,
  project,
  ...other
}: TestCasesScreenStatelessProps) => (
  <div className="tailwind" style={{ marginLeft: "-15px", marginRight: "-15px" }}>
    <div className="pt-8 pb-8 font-sans font-normal bg-neutral-fade6 text-neutral">
      {beforeFilters}
      <TestCasesFilter
        disabled={disableFilters}
        projectAttributes={attributes}
        groups={groups}
        filters={filters}
        onChangeFilters={onChangeFilters}
        onChangeGroups={onChangeGroups}
        showSave={!!showSaveSuite}
        onSaveSuiteClick={onSaveSuiteClick}
      />

      <Suspense
        fallback={
          <div className="flex justify-center mt-8">
            <Loading />
          </div>
        }
      >
        {groups.length === 0 ? (
          <TestCaseList {...other} filters={filters} attributes={attributes} project={project} />
        ) : (
          <TestCaseTree
            {...other}
            groups={groups}
            exclusionState={exclusionState}
            filters={filters}
            project={project}
            attributes={attributes}
          />
        )}
      </Suspense>
    </div>
  </div>
);
