import React, { useState } from "react";
import CustomListbox from "../../../components/ui/ListBox";

export default {
  component: CustomListbox,
  title: "components/ui/ListBox",
  args: { label: "test" },
};

export const Default = (args: any) => {
  const [state, setState] = useState({ attribute: undefined, values: [] });
  return (
    <CustomListbox value={state} onChange={setState} {...args}>
      <CustomListbox.Option key="foo" value="foo">
        Foo
      </CustomListbox.Option>
      <CustomListbox.Option key="bar" value="bar">
        Bar
      </CustomListbox.Option>
    </CustomListbox>
  );
};
