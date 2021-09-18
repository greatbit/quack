import React from "react";
import SuiteHeader from "../../../testcases/SuiteHeader";

export default {
  component: SuiteHeader,
  title: "components/suite/SuiteHeader",
  args: {
    name: "My suite name",
  },
  argTypes: { onChange: { action: true } },
};

export const Default = args => <SuiteHeader {...args} />;
