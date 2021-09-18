import clsx from "clsx";
import { FunctionComponent, memo } from "react";
import { GroupState, TestCaseGroup } from "../../domain";
import Checkbox from "../ui/Checkbox";
import TestCaseListItem from "./TestCaseListItem";
import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";
import { focusClasses } from "../ui/focus";

export type TestCaseGroupProps = {
  testCaseGroup: TestCaseGroup;
  getGroupState: (id: string) => GroupState;
  isTestCaseSelected: (id: string) => boolean;
  isGroupOpen: (id: string) => boolean;
  selectedTestCase: string | undefined;
  onTestCaseClick: (id: string) => void;
  onTestCaseCheckboxClick: (id: string) => void;
  onCheckboxClick: (id: string) => void;
  onChevronClick: (id: string) => void;
  level: number;
  disabled?: boolean;
};

const TestCaseGroupComponent: FunctionComponent<TestCaseGroupProps> = memo(
  ({
    isGroupOpen,
    getGroupState,
    isTestCaseSelected,
    testCaseGroup,
    onTestCaseClick,
    onTestCaseCheckboxClick,
    onCheckboxClick,
    onChevronClick,
    selectedTestCase,
    level,
    disabled,
  }) => (
    <div>
      <div className="pl-5 pr-5 pt-3 pb-3 flex items-center gap-2" style={{ marginLeft: `${level * 28}px` }}>
        <button className={focusClasses} onClick={() => onChevronClick(testCaseGroup.id)}>
          <ChevronRightIcon
            className={clsx("w-5 h-5 text-neutral-fade2 transform-gpu transition-transform", {
              "rotate-90": isGroupOpen(testCaseGroup.id),
            })}
          />
        </button>
        <Checkbox
          className="text-neutral-fade2"
          onClick={() => onCheckboxClick(testCaseGroup.id)}
          checked={getGroupState(testCaseGroup.id) === GroupState.Selected}
          indeterminate={getGroupState(testCaseGroup.id) === GroupState.Indeterminate}
          disabled={disabled}
        />
        {testCaseGroup.title}
      </div>
      {isGroupOpen(testCaseGroup.id) && (
        <>
          {(testCaseGroup.children ?? []).map(childGroup => (
            <TestCaseGroupComponent
              key={childGroup.id}
              getGroupState={getGroupState}
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
  ),
);

export default TestCaseGroupComponent;
