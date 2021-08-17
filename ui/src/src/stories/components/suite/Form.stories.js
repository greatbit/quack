import React from "react";
import SuiteDialog from "../../../components/suite/Dialog";
import Form from "../../../components/suite/Form";
export default {
  component: Form,
  title: "components/suite/Form",
  args: {
    initialValues: { name: "Test suite" },
  },
  argTypes: { onSubmit: { action: true }, onCancel: { action: true } },
};

export const Default = args => <Form {...args} />;
export const Dialog = args => <SuiteDialog {...args} />;
