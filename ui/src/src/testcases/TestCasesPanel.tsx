import Button from "../components/ui/Button";
import { PropsWithChildren, useMemo } from "react";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import { ExistingAttribute, FakeAttribute } from "../domain";
import TestCase from "./TestCase";
import { mapClientAttributeToServer } from "../services/backend";

export type TestCasesPanelProps = PropsWithChildren<{
  projectID: string;
  selectedTestCaseID: string | undefined;
  attributes: (ExistingAttribute | FakeAttribute)[];
}>;

const useLegacyAttributes = (attributes: (ExistingAttribute | FakeAttribute)[]) =>
  useMemo(() => attributes.map(mapClientAttributeToServer), [attributes]);

const TestCasesPanel = ({ children, selectedTestCaseID, projectID, attributes }: TestCasesPanelProps): JSX.Element => {
  const legacyAttributes = useLegacyAttributes(attributes);
  return (
    <div className="flex mt-5 gap-3">
      <div className="w-1/3 bg-white ml-8 pb-8  border">
        <div className="flex gap-2 pt-5 pl-5 items-middle flex-wrap">
          <h2 className="text-xl text-neutral flex-grow">Test cases</h2>
          <Button.Primary className="flex gap-2 pl-3 pr-3 items-center">
            <PlayIcon className="w-5 h-5" />
            Launch
          </Button.Primary>
        </div>
        {children}
      </div>
      <div className="w-2/3 mr-8 bg-white border p-5">
        {selectedTestCaseID && (
          <TestCase projectId={projectID} projectAttributes={legacyAttributes} testcaseId={selectedTestCaseID} />
        )}
      </div>
    </div>
  );
};

export default TestCasesPanel;
