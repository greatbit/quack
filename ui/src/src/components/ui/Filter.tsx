import { EventHandler, MouseEvent, useMemo } from "react";
import SelectedValues from "./SelectedValues";
import { BasicListbox as CustomListbox } from "./ListBox";
import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { inputBackgroundClasses, inputBorderClasses, inputTextClasses } from "./input";
import clsx from "clsx";
import { focusClasses } from "./focus";
import { ExistingAttribute, FakeAttribute } from "../../domain";

export type FilterValue = {
  attribute: string | undefined;
  values: string[];
};
export type FilterProps = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  attributes: (ExistingAttribute | FakeAttribute)[];
  onRemoveClick: EventHandler<MouseEvent>;
};
const Filter = ({ value, onChange, attributes, onRemoveClick }: FilterProps) => {
  const selectedAttribute = useMemo(
    () => attributes.find(attribute => attribute.id === value?.attribute),
    [attributes, value],
  );

  const selectedValues = value?.values || [];
  const handleAttributeChange = (attribute: string | undefined) => {
    onChange({ attribute, values: [] });
  };
  const handleValueChange = (newValue: string) => {
    const prev = value?.values ?? [];
    onChange({
      ...value,
      values: prev.includes(newValue) ? prev.filter(value => value !== newValue) : [...prev, newValue],
    });
  };
  const handleRemoveValueClick = (e: MouseEvent, removeValue: string) => {
    e.stopPropagation();
    const prev = value?.values ?? [];
    onChange({
      ...value,
      values: prev.filter(value => value !== removeValue),
    });
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 flex-nowrap pl-3",
        inputBorderClasses,
        inputBackgroundClasses,
        inputTextClasses,
      )}
    >
      <CustomListbox
        className="flex-grow flex-shrink-0"
        buttonClassName="pl-1"
        value={value?.attribute}
        onChange={handleAttributeChange}
        label={
          value?.attribute ? (
            selectedAttribute?.name
          ) : (
            <CustomListbox.Placeholder>Select attribute</CustomListbox.Placeholder>
          )
        }
      >
        {attributes.map(attribute => (
          <CustomListbox.Option key={attribute.id} value={attribute.id}>
            {attribute.name}
          </CustomListbox.Option>
        ))}
      </CustomListbox>
      <span className="font-semibold">{selectedValues.length > 1 ? "in" : "="}</span>
      <CustomListbox
        className="flex-grow flex-shrink-0"
        buttonClassName="pl-1"
        value={selectedValues as any}
        onChange={handleValueChange}
        label={
          selectedValues.length ? (
            <SelectedValues
              values={selectedValues}
              allValues={selectedAttribute?.values || []}
              onRemoveClick={handleRemoveValueClick}
            />
          ) : (
            <CustomListbox.Placeholder>Select value</CustomListbox.Placeholder>
          )
        }
      >
        {!!selectedAttribute?.values.length &&
          selectedAttribute?.values.map(attributeValue => (
            <CustomListbox.Option
              key={attributeValue.id}
              value={attributeValue.id}
              forceSelected={selectedValues.includes(attributeValue.id)}
            >
              {attributeValue.name}
            </CustomListbox.Option>
          ))}
      </CustomListbox>
      <button
        className={clsx("mr-2 text-neutral-fade2 hover:text-neutral-fade1 ", focusClasses)}
        onClick={onRemoveClick}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
export default Filter;
