import React, { useState } from "react";

import Filters from "../../../components/ui/Filters";
import { attributes } from "./attributes";

export default {
  component: Filters,
  title: "components/ui/Filters",
  args: {
    attributes,
  },
};

export const Default = args => {
  const [state, setState] = useState([]);
  return <Filters value={state} onChange={setState} {...args} />;
};
