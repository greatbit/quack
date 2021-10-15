import { MouseEvent } from "react";
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
  argTypes: {
    onRemoveClick: { action: true },
  },
};

export const Default = (args: {
  values: string[];
  allValues: any;
  onRemoveClick: (e: MouseEvent, value: string) => void;
}) => {
  return (
    <div className="bg-neutral-fade6 rounded-md flex p-3">
      <SelectedValues {...args} />
    </div>
  );
};
