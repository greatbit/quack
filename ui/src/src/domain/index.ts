export interface WithID {
  readonly id: string;
}

export type DeletedMeta = {
  readonly deleted: boolean;
};

export type TimeMeta = {
  readonly createdTime: number;
  readonly lastModifiedTime: number;
};

export type Meta = TimeMeta &
  DeletedMeta & {
    readonly createdBy: string;
    readonly lastModifiedBy: string;
  };

export type LauncherProperties = {
  readonly requestBody?: string;
  readonly endpoint?: string;
  readonly requestHeaders?: string;
  readonly requestType?: string;
  readonly timeout?: string;
};

export type NewLaunchConfig = {
  readonly name: string;
  readonly environments: string[];
  readonly launcherId: string;
  readonly launcherUuid: string;
  readonly endpoint: string;
  readonly method: string;
  readonly headers: string;
  readonly body: string;
  readonly timeout: string;
};

export type ExistingLaunchConfig = WithID & {
  readonly name: string;
  readonly properties: LauncherProperties;
  readonly uuid: string;
};

export type ProjectData = {
  name: string;
  description: string;
  launcherConfigs: ExistingLaunchConfig[];
  environments: string[];
};
export type ExistingProject = ProjectData & Meta & WithID;
export interface AttributeValue extends WithID {
  readonly name: string;
}

export type ExistingAttribute = WithID &
  Meta & {
    readonly name: string;
    readonly values: AttributeValue[];
  };

export const isExistingAttribute = (attribute: ExistingAttribute | FakeAttribute): attribute is ExistingAttribute =>
  !!(attribute as ExistingAttribute).createdTime;
export type FakeAttribute = WithID & {
  readonly name: "Broken";
  readonly values: AttributeValue[];
};
export interface AttributeFilter {
  readonly attribute: string;
  readonly values: string[];
}
export type AttributeFilterDraft = {
  readonly attribute: string | undefined;
  readonly values: string[];
};
export type ExistingAttributeFilter = AttributeFilter & DeletedMeta & TimeMeta;
export const isExistingAttributeFilter = (
  filter: ExistingAttributeFilter | AttributeFilterDraft,
): filter is ExistingAttributeFilter => !!(filter as ExistingAttributeFilter).createdTime;

export interface Suite {
  readonly name: string;
  readonly filters: (ExistingAttributeFilter | AttributeFilterDraft)[];
  readonly groups: string[];
  readonly excludedTestCases: string[];
}

export type SuiteDraft = {
  readonly name: string;
  readonly filters: AttributeFilterDraft[];
  readonly excludedTestCases: string[];
};
export type ExistingSuite = WithID & Meta & Suite;

export interface TestCase {
  readonly name: string;
  readonly description: string;
  readonly attributes: FilterValue[];
}

export type ExistingTestCase = WithID &
  TestCase &
  Meta & {
    readonly automated: boolean;
    readonly broken: boolean;
    readonly metadata: Record<string, any>;
    readonly steps: never[];
  };
export type FilterValue = {
  attribute: string | undefined;
  values: string[];
};
export type NewTestCase = {
  name: string;
  description: string;
  attributes: FilterValue[];
};
export type TestCaseGroup = {
  readonly id: string;
  readonly count: number;
  readonly isLeaf: boolean;
  readonly testCases: ExistingTestCase[];
  readonly children: TestCaseGroup[] | undefined;
  readonly title: string;
};
export type RootTestCaseGroup = Omit<TestCaseGroup, "id"> & { children?: TestCaseGroup[] };

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
