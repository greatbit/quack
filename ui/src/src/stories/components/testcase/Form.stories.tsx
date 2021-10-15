import { RefObject } from "react";
import TestCaseDialog from "../../../components/testcase/Dialog";
import Form, { FormValues } from "../../../components/testcase/Form";
import { ExistingAttribute, FakeAttribute } from "../../../domain";
import { attributes } from "../ui/attributes";

export type Args = {
  readonly initialValues: FormValues;
  readonly initialFocus: RefObject<HTMLInputElement>;
};

export type Actions = {
  attributes: (ExistingAttribute | FakeAttribute)[];
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: VoidFunction;
  initialValues: FormValues;
};

export default {
  component: Form,
  title: "components/testcase/Form",
  args: {
    initialValues: { attributes: [{ attribute: "foo", values: ["foo-value-1"] }] },
    attributes,
  },
};

export const Default = (args: Args & Actions) => <Form {...args} />;
export const Dialog = (args: any) => <TestCaseDialog {...args} />;
