import clsx from "clsx";
import { FunctionComponent, memo, useMemo } from "react";
import { getAllTestCases, GroupState, TestCaseGroup } from "../../domain";
import Checkbox from "../ui/Checkbox";
import TestCaseListItem, { getIndentStyle } from "./TestCaseListItem";
import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import { focusClasses } from "../ui/focus";

export type TestCaseGroupProps = {
  testCaseGroup: TestCaseGroup;
  isTestCaseSelected: (id: string) => boolean;
  isGroupOpen: (id: string) => boolean;
  selectedTestCase: string | undefined;
  onTestCaseClick: (id: string) => void;
  onTestCaseCheckboxClick: (id: string) => void;
  onCheckboxClick: (group: TestCaseGroup) => void;
  onChevronClick: (id: string) => void;
  level: number;
  disabled?: boolean;
};

const useGroupState = (group: TestCaseGroup, isTestCaseSelected: (id: string) => boolean) => {
  return useMemo(() => {
    const testCases = getAllTestCases([group]).map(testCase => testCase.id);
    const selections = testCases.map(id => isTestCaseSelected(id));
    const hasSelected = selections.some(Boolean);
    const hasExcluded = selections.some(value => !value);
    if (!hasSelected) {
      return GroupState.Unselected;
    } else if (!hasExcluded) {
      return GroupState.Selected;
    }
    return GroupState.Indeterminate;
  }, [isTestCaseSelected, group]);
};

const TestCaseGroupComponent: FunctionComponent<TestCaseGroupProps> = memo(
  ({
    isGroupOpen,
    isTestCaseSelected,
    testCaseGroup,
    onTestCaseClick,
    onTestCaseCheckboxClick,
    onCheckboxClick,
    onChevronClick,
    selectedTestCase,
    level,
    disabled,
  }) => {
    const state = useGroupState(testCaseGroup, isTestCaseSelected);
    return (
      <div>
        <div className="pr-5 pt-3 pb-3 flex items-center gap-2" style={getIndentStyle(level)}>
          <button className={focusClasses} onClick={() => onChevronClick(testCaseGroup.id)}>
            <ChevronRightIcon
              className={clsx("w-6 h-6 text-neutral-fade2 transform-gpu transition-transform", {
                "rotate-90": isGroupOpen(testCaseGroup.id),
              })}
            />
          </button>
          <Checkbox
            className="text-neutral-fade2"
            onClick={() => onCheckboxClick(testCaseGroup)}
            checked={state === GroupState.Selected}
            indeterminate={state === GroupState.Indeterminate}
            disabled={disabled}
          />
          {testCaseGroup.title}
        </div>
        {isGroupOpen(testCaseGroup.id) && (
          <>
            {(testCaseGroup.children ?? []).map(childGroup => (
              <TestCaseGroupComponent
                key={childGroup.id}
                onCheckboxClick={onCheckboxClick}
                onTestCaseCheckboxClick={onTestCaseCheckboxClick}
                onTestCaseClick={onTestCaseClick}
                testCaseGroup={childGroup}
                isGroupOpen={isGroupOpen}
                selectedTestCase={selectedTestCase}
                isTestCaseSelected={isTestCaseSelected}
                onChevronClick={onChevronClick}
                level={level + 1}
              />
            ))}
            {testCaseGroup.testCases.map(testCase => (
              <TestCaseListItem
                key={testCase.id}
                testCase={testCase}
                onClick={onTestCaseClick}
                onCheckboxClick={onTestCaseCheckboxClick}
                selected={selectedTestCase === testCase.id}
                checked={isTestCaseSelected(testCase.id)}
                level={level}
              />
            ))}
          </>
        )}
      </div>
    );
  },
);

export default TestCaseGroupComponent;
