import { ReactNode, Suspense } from "react";
import { Loading } from "../components/ui";
import { AttributeFilterDraft, ExistingAttribute, ExistingAttributeFilter, FakeAttribute } from "../domain";
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
  projectID: string;
  isTestCaseSelected: (id: string) => boolean;
  onToggleTestCase: (id: string) => void;
  showSaveSuite?: boolean;
  onSaveSuiteClick?: () => void;
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
  ...other
}: TestCasesScreenStatelessProps) => (
  <div className="tailwind" style={{ marginLeft: "-15px", marginRight: "-15px" }}>
    <div className="bg-neutral-fade6 pt-8 pb-8 font-sans text-neutral font-normal">
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
          <TestCaseList {...other} filters={filters} attributes={attributes} />
        ) : (
          <TestCaseTree
            {...other}
            groups={groups}
            exclusionState={exclusionState}
            filters={filters}
            attributes={attributes}
          />
        )}
      </Suspense>
    </div>
  </div>
);
