import { PropsWithChildren, FunctionComponent } from "react";

export type TestCaseListProps = PropsWithChildren<{}>;
const TestCaseList: FunctionComponent<TestCaseListProps> = ({ children }) => <ul className="m-0 ">{children}</ul>;

export default TestCaseList;
