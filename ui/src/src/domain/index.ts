export interface WithID {
  id: string;
}

export interface AttributeValue extends WithID {
  name: string;
}

export interface Attribute extends WithID {
  name: string;
  values: AttributeValue[];
}

export interface TestCaseFilter {}
export interface Suite extends WithID {
  name: string;
  filter: TestCaseFilter;
}
