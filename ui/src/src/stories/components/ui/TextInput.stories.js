import React from "react";

import TextInput from "../../../components/ui/TextInput";

export default {
  component: TextInput,
  title: "components/ui/TextInput",
  args: {
    value: "Some value",
    type: "text",
  },
  argTypes: { onChange: { action: true } },
};

export const Default = args => <TextInput {...args} />;
