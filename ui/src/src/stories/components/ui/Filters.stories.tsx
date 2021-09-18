import React, { useState } from "react";
import { FilterValue } from "../../../components/ui/Filter";

import Filters from "../../../components/ui/Filters";
import { ExistingAttribute } from "../../../domain";
import { attributes } from "./attributes";

export default {
  component: Filters,
  title: "components/ui/Filters",
  args: {
    attributes,
  },
};

export const Default = (args: { attributes: ExistingAttribute[] }) => {
  const [state, setState] = useState<FilterValue[]>([]);
  return <Filters {...args} value={state} onChange={setState} />;
};
