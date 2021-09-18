import React, { useState } from "react";

import Filter from "../../../components/ui/Filter";
import { attributes } from "./attributes";

export default {
  component: Filter,
  title: "components/ui/Filter",
  args: { attributes },
};

export const Default = (args: any) => {
  const [state, setState] = useState({ attribute: undefined, values: [] });
  return <Filter value={state} onChange={setState} {...args} />;
};
