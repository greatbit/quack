import { ExistingTestCase, TestCaseGroup } from "../../../domain";
import List from "../../../components/testcase/List";
import TestCaseListItem from "../../../components/testcase/TestCaseListItem";
import TestCaseGroupComponent from "../../../components/testcase/TestCaseGroup";
import { useState } from "react";
import { useSelection, useExclusion, ExclusionHash } from "../../../testcases/hooks";

import { useToggleGroupState } from "../../../testcases/TestCaseTree";

export type Args = {
  testCases: ExistingTestCase[];
};

export type Actions = {
  onClick: (id: string) => void;
  onCheckboxClick: (id: string) => void;
  onChevronClick: (id: string) => void;
  onToggleGroupClick: (group: TestCaseGroup) => void;
};

const testCases: ExistingTestCase[] = [
  {
    id: "1",
    name: "TestCase 1",
  },
  {
    id: "2",
    name: "TestCase 2. It has a very very very, incredibly long name.",
  },
  {
    id: "3",
    name: "TestCase 3. It has a very very very, incredibly long name.",
  },
  {
    id: "4",
    name: "TestCase 3. It has a very very very, incredibly long name.",
  },
];

const args: Args = {
  testCases,
};

export default {
  component: List,
  title: "components/testcase/List",
  args,
  argTypes: { onClick: { action: true }, onCheckboxClick: { action: true }, onChevronClick: { action: true } },
};

export const Default = ({ testCases, onClick, onCheckboxClick, ...other }: Args & Actions) => {
  return (
    <List>
      <TestCaseListItem
        testCase={testCases[0]}
        selected
        onClick={onClick}
        onCheckboxClick={onCheckboxClick}
        level={0}
      />
      <TestCaseListItem testCase={testCases[2]} onClick={onClick} onCheckboxClick={onCheckboxClick} level={0} />
      <TestCaseListItem
        testCase={testCases[1]}
        selected
        checked
        onClick={onClick}
        onCheckboxClick={onCheckboxClick}
        level={0}
      />
      <TestCaseListItem testCase={testCases[3]} checked onClick={onClick} onCheckboxClick={onCheckboxClick} level={0} />
    </List>
  );
};

const group1: TestCaseGroup = {
  id: "group1",
  title: "Group 1",
  isLeaf: true,
  count: 2,
  children: [],
  testCases: [testCases[0], testCases[1]],
};
const group2: TestCaseGroup = {
  id: "group2",
  title: "Group2",
  isLeaf: false,
  count: 1,
  children: [group1],
  testCases: [testCases[2]],
};

export const Grouped = ({
  testCases,
  onClick,
  onCheckboxClick,
  onToggleGroupClick,
  onChevronClick,
  ...other
}: Args & Actions) => {
  return (
    <List>
      <TestCaseGroupComponent
        testCaseGroup={group2}
        isGroupOpen={id => ["group1", "group2"].includes(id)}
        selectedTestCase="1"
        isTestCaseSelected={id => ["1", "2"].includes(id)}
        onCheckboxClick={onToggleGroupClick}
        onTestCaseCheckboxClick={onCheckboxClick}
        onTestCaseClick={onClick}
        onChevronClick={onChevronClick}
        level={0}
      />
    </List>
  );
};

export const GroupedStateful = () => {
  const [selectedTestCase, setSelectedTestCase] = useState<string | undefined>(undefined);
  const [openGroups, handleChevronClick] = useSelection(["group1"]);
  const exclusionState = useState<ExclusionHash>({});
  const [isTestCaseSelected, handleTestCaseCheckboxClick] = useExclusion(exclusionState);
  // const [isGroupSelected, handleCheckboxClick] = useTreeExclusion([group2], exclusionState[0], exclusionState[1]);
  const toggleGroupState = useToggleGroupState(exclusionState);
  return (
    <List>
      <TestCaseGroupComponent
        testCaseGroup={group2}
        isGroupOpen={openGroups}
        selectedTestCase={selectedTestCase}
        isTestCaseSelected={isTestCaseSelected}
        onCheckboxClick={toggleGroupState}
        onTestCaseCheckboxClick={handleTestCaseCheckboxClick}
        onTestCaseClick={setSelectedTestCase}
        onChevronClick={handleChevronClick}
        level={0}
      />
    </List>
  );
};
