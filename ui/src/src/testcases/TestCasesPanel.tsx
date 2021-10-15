import Button, { linkNeutralClasses } from "../components/ui/Button";
import { PropsWithChildren, useMemo, useState } from "react";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import PlusCircleIcon from "@heroicons/react/outline/PlusCircleIcon";
import {
  ExistingAttribute,
  ExistingProject,
  ExistingSuite,
  ExistingTestCase,
  FakeAttribute,
  NewLaunchConfig,
  SuiteDraft,
} from "../domain";
import TestCase from "./TestCase";
import { backendService, mapClientAttributeToServer } from "../services/backend";
import clsx from "clsx";
import { captionClasses } from "../components/ui/typography";
import Dialog from "../components/testcase/Dialog";
import RunDialog from "../components/run/Dialog";
import { FormValues as RunFormValues } from "../components/run/Form";
import { FormValues } from "../components/testcase/Form";
import { useHistory } from "react-router";

export type TestCasesPanelProps = PropsWithChildren<{
  project: ExistingProject;
  selectedTestCaseID: string | undefined;
  attributes: (ExistingAttribute | FakeAttribute)[];
  onTestCaseAdded: (testCase: ExistingTestCase) => void;
  suite: SuiteDraft | ExistingSuite;
}>;

const useLegacyAttributes = (attributes: (ExistingAttribute | FakeAttribute)[]) =>
  useMemo(() => attributes.map(mapClientAttributeToServer), [attributes]);

const TestCasesPanel = ({
  children,
  selectedTestCaseID,
  project,
  attributes,
  onTestCaseAdded,
  suite,
}: TestCasesPanelProps): JSX.Element => {
  const legacyAttributes = useLegacyAttributes(attributes);
  const [showAddTestCase, setShowAddTestCase] = useState(false);
  const handleAddFormSubmit = async (values: FormValues) => {
    setShowAddTestCase(false);
    onTestCaseAdded(await backendService.project(project.id).testCases.create(values, attributes));
  };
  const [showLaunch, setShowLaunch] = useState(false);
  const history = useHistory();
  const handleLaunchSubmit = async ({ launcherId, ...other }: RunFormValues) => {
    const result = await backendService.project(project.id).launches.create(
      {
        ...other,
        launcherId: launcherId!,
      } as NewLaunchConfig,
      suite,
    );
    history.push(`/${project.id}/launch/${result.id}`);
  };

  return (
    <>
      {showAddTestCase && (
        <Dialog attributes={attributes} onCancel={() => setShowAddTestCase(false)} onSubmit={handleAddFormSubmit} />
      )}
      {showLaunch && (
        <RunDialog
          environments={project.environments}
          launcherConfigs={project.launcherConfigs}
          onCancel={() => setShowLaunch(false)}
          onSubmit={handleLaunchSubmit}
        />
      )}
      <div className="flex mt-5 gap-3">
        <div className="w-1/3 pb-8 ml-8 bg-white border">
          <div className="flex flex-wrap items-center pt-5 pl-5 gap-2">
            {/* <h2 className={clsx("font-medium m-0 flex-grow")}>Test cases</h2> */}
            <h2 className={clsx(captionClasses, "flex-grow")}>Test cases</h2>
            <Button.Link
              className={clsx("flex gap-2 items-center", linkNeutralClasses)}
              onClick={() => setShowAddTestCase(true)}
            >
              <PlusCircleIcon className="w-6 h-6" />
              Add
            </Button.Link>
            <Button.Primary className="flex items-center pl-3 pr-3 gap-2" onClick={() => setShowLaunch(true)}>
              <PlayIcon className="w-6 h-6" />
              Launch
            </Button.Primary>
          </div>
          {children}
        </div>
        <div className="w-2/3 p-5 mr-8 bg-white border pb-7">
          {selectedTestCaseID && (
            <TestCase projectId={project.id} projectAttributes={legacyAttributes} testcaseId={selectedTestCaseID} />
          )}
        </div>
      </div>
    </>
  );
};

export default TestCasesPanel;
