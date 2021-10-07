import { ReactNode, useState } from "react";
import { FilterValue } from "../../../components/ui/Attribute";

import Attributes from "../../../components/ui/Attributes";
import { ExistingAttribute } from "../../../domain";
import { attributes } from "./attributes";

export default {
  component: Attributes,
  title: "components/ui/Attributes",
  args: {
    attributes,
    addLinkContent: "Add filter",
  },
};

export const Default = (args: { attributes: ExistingAttribute[]; addLinkContent: ReactNode }) => {
  const [state, setState] = useState<FilterValue[]>([]);
  return <Attributes {...args} value={state} onChange={setState} />;
};
