export interface WithID {
  id: string;
}

export type DeletedMeta = {
  deleted: boolean;
};

export type TimeMeta = {
  createdTime: number;
  lastModifiedTime: number;
};

export type Meta = TimeMeta &
  DeletedMeta & {
    createdBy: string;
    lastModifiedBy: string;
  };

export interface AttributeValue extends WithID {
  name: string;
}

export type ExistingAttribute = WithID &
  Meta & {
    name: string;
    values: AttributeValue[];
  };

export type FakeAttribute = WithID & {
  name: "Broken";
  values: AttributeValue[];
};
export interface AttributeFilter {
  attribute: string;
  values: string[];
}
export type AttributeFilterDraft = {
  attribute: string | undefined;
  values: string[];
};
export type ExistingAttributeFilter = AttributeFilter & DeletedMeta & TimeMeta;
export interface Suite {
  name: string;
  filters: ExistingAttributeFilter[];
  excludedTestCases: string[];
}

export type SuiteDraft = {
  name: string;
  filters: AttributeFilterDraft[];
  excludedTestCases: string[];
};
export type ExistingSuite = WithID & Meta & Suite;

export interface TestCase {
  name: string;
}

export type ExistingTestCase = WithID & TestCase;
export type TestCaseGroup = {
  id: string;
  count: number;
  isLeaf: boolean;
  testCases: ExistingTestCase[];
  children: TestCaseGroup[] | undefined;
  title: string;
};
export type RootTestCaseGroup = Omit<TestCaseGroup, "id"> & { children: TestCaseGroup[] };

export const flattenGroup = (group: TestCaseGroup): TestCaseGroup[] => [
  group,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...(group.children ?? []).reduce<TestCaseGroup[]>((arr, child) => [...arr, ...flattenGroup(child)], []),
];
export const flattenGroups = (groups: TestCaseGroup[]): TestCaseGroup[] =>
  groups.reduce<TestCaseGroup[]>((arr, group) => [...arr, ...flattenGroup(group)], []);
export const getAllTestCases = (groups: TestCaseGroup[]): ExistingTestCase[] =>
  flattenGroups(groups).reduce<ExistingTestCase[]>((cases, group) => [...cases, ...group.testCases], []);

export const listToBoolHash = (list: string[], value: boolean = true) => {
  const hash: Record<string, boolean> = {};
  for (const id of list) {
    hash[id] = value;
  }
  return hash;
};
export const getFullySelectedTestCaseHash = (testCases: ExistingTestCase[], value: boolean = true) =>
  listToBoolHash(testCases.map(testCase => testCase.id));
export const getFullySetHash = (groups: TestCaseGroup[], value: boolean = true) =>
  listToBoolHash(
    flattenGroups(groups).map(group => group.id),
    value,
  );

export const getGroupLookup = (groups: TestCaseGroup[]) =>
  groups.reduce<Record<string, TestCaseGroup>>((lookup, group) => ({ ...lookup, [group.id]: group }), {});

export enum GroupState {
  // eslint-disable-next-line no-unused-vars
  Selected = "Selected",
  // eslint-disable-next-line no-unused-vars
  Indeterminate = "Indeterminate",
  // eslint-disable-next-line no-unused-vars
  Unselected = "Unselected",
}
