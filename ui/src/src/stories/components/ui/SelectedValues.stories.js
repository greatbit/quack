import React from "react";
import SelectedValues from "../../../components/ui/SelectedValues";
import { attributes } from "./attributes";

const allValues = attributes[0].values;

export default {
  component: SelectedValues,
  title: "components/ui/SelectedValues",
  args: {
    values: allValues.map(val => val.id),
    allValues,
  },
};

export const Default = args => {
  return (
    <div className="bg-neutral-fade4 flex p-3">
      <SelectedValues {...args} />
    </div>
  );
};
