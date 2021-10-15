import { RefObject } from "react";
import RunDialog from "../../../components/run/Dialog";
// import TestCaseDialog from "../../../components/run/Dialog";
import Form, { FormValues } from "../../../components/run/Form";
import { ExistingAttribute, ExistingLaunchConfig, FakeAttribute } from "../../../domain";

export type Args = {
  readonly initialValues: FormValues;
  readonly initialFocus: RefObject<HTMLInputElement>;
  readonly launcherConfigs: ExistingLaunchConfig[];
  readonly environments: string[];
};

export type Actions = {
  attributes: (ExistingAttribute | FakeAttribute)[];
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: VoidFunction;
  initialValues: FormValues;
};

const launcherConfigs: ExistingLaunchConfig[] = [
  {
    launcherId: "request-launcher",
    name: "Launch config 1",
    properties: {},
    uuid: "config-1",
  },
  {
    launcherId: "request-launcher",
    name: "Launch config 2",
    properties: {
      endpoint: "http://google.com",
      requestBody: "body",
      requestHeaders: "headers",
      requestType: "PUT",
      timeout: "100",
    },
    uuid: "config-1",
  },
];

export default {
  component: Form,
  title: "components/run/Form",
  args: {
    initialValues: { environments: [] },
    environments: ["test", "test2"],
    launcherConfigs,
  },
};

export const Default = (args: Args & Actions) => <Form {...args} />;
export const Dialog = ({ initialValues, ...other }: Args & Actions) => <RunDialog {...other} />;
