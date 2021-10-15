import React, { useState } from "react";

import Attribute from "../../../components/ui/Attribute";
import { attributes } from "./attributes";

export default {
  component: Attribute,
  title: "components/ui/Attribute",
  args: { attributes },
};

export const Default = (args: any) => {
  const [state, setState] = useState({ attribute: undefined, values: [] });
  return <Attribute value={state} onChange={setState} {...args} />;
};
