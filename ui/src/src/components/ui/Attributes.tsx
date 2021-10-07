import Attribute, { FilterValue } from "./Attribute";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import { ExistingAttribute, FakeAttribute } from "../../domain";
import clsx from "clsx";
import { ReactNode } from "react";

export type AttributesProps = {
  attributes: (ExistingAttribute | FakeAttribute)[];
  value: FilterValue[];
  onChange: (value: FilterValue[]) => void;
  disabled?: boolean;
  className?: string;
  addLinkContent: ReactNode;
};

const Attributes = ({ attributes, value, onChange, disabled, className, addLinkContent }: AttributesProps) => {
  const handleFilterChange = (index: number) => (newValue: FilterValue) =>
    onChange(value.map((filter, i) => (i === index ? newValue : filter)));
  const handleRemoveFilterClick = (index: number) => () =>
    onChange(value.map((filter, i) => (i === index ? undefined : filter)!).filter(Boolean));
  const handleAddFilterClick = () => onChange([...value, { attribute: undefined, values: [] }]);
  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {value.map((filter, index) => (
        <Attribute
          disabled={disabled}
          key={index}
          value={filter}
          attributes={attributes}
          onChange={handleFilterChange(index)}
          onRemoveClick={handleRemoveFilterClick(index)}
        />
      ))}
      <button
        className="flex items-center text-base text-primary gap-1 focus:outline-focus"
        onClick={handleAddFilterClick}
        disabled={disabled}
        type="button"
      >
        <PlusCircleIcon className="w-5 h-5" />
        <span>{addLinkContent}</span>
      </button>
    </div>
  );
};

export default Attributes;
