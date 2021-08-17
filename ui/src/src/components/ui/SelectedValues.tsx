import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { EventHandler, MouseEvent, ReactNode } from "react";

export interface Value {
  id: string;
  name: string;
}
export interface SelectedValueProps {
  value: string;
  label: ReactNode;
  onRemoveClick: (e: MouseEvent, value: string) => void;
}

const SelectedValue = ({ value, label, onRemoveClick }: SelectedValueProps) => (
  <span className="bg-neutral-fade2 rounded-md h-5 text-white text-sm flex items-center gap-2 pl-2 pr-1">
    <span>{label}</span>
    <span onClick={e => onRemoveClick(e, value)}>
      <XCircleIcon className="w-3 h-3" />
    </span>
  </span>
);

export interface SelectedValuesProps<TValue extends Value> {
  values: string[];
  allValues: TValue[];
  onRemoveClick: EventHandler<MouseEvent>;
}
const SelectedValues = <TValue extends Value>({ values, allValues, onRemoveClick }: SelectedValuesProps<TValue>) => (
  <div className="flex flex-wrap gap-2 mt-2 mb-2">
    {values.map(value => (
      <SelectedValue
        key={value}
        value={value}
        label={allValues.find(val => val.id === value)?.name}
        onRemoveClick={onRemoveClick}
      />
    ))}
  </div>
);

export default SelectedValues;
