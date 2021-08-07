import CheckIcon from "@heroicons/react/solid/CheckIcon";
import SelectorIcon from "@heroicons/react/solid/SelectorIcon";
import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useMemo } from "react";

const CustomListbox = ({ label, value, onChange, children, className }) => (
  <Listbox value={value} onChange={onChange} as="div" className={clsx(className, "relative", "flex")}>
    <Listbox.Button className={clsx("flex h-10 items-center gap-2", className)}>
      <span className="flex-grow">{label}</span>
      <SelectorIcon className="w-4 h-4 text-neutral-fade2 hover:text-neutral-fade1 transition-colors duration-200" />
    </Listbox.Button>
    <Listbox.Options className="absolute w-max min-w-max bg-white shadow-lg rounded-md overflow-hidden">
      {children}
    </Listbox.Options>
  </Listbox>
);

const Placeholder = ({ children }) => <span className="text-neutral-fade2">{children}</span>;

const Option = ({ value, label, forceSelected }) => (
  <Listbox.Option value={value}>
    {({ active, selected }) => (
      <div
        className={clsx(
          "pt-2 pb-2 flex gap-2 items-center pl-3 pr-4 transition-colors duration-200 whitespace-nowrap",
          {
            "bg-primary": active,
            "text-white": active,
            "text-neutral-fade1": !active,
          },
        )}
      >
        <CheckIcon className={clsx("w-5 h-5", { invisible: !selected && !forceSelected })} />
        <span className={clsx({ "font-semibold": selected || forceSelected })}>{label}</span>
      </div>
    )}
  </Listbox.Option>
);

const SelectedValue = ({ value, label, onRemoveClick }) => (
  <span className="bg-neutral-fade1 rounded-md h-5 text-white text-sm flex items-center gap-2 pl-2 pr-1">
    <span>{label}</span>
    <button onClick={e => onRemoveClick(e, value)}>
      <XCircleIcon className="w-3 h-3" />
    </button>
  </span>
);

export const SelectedValues = ({ values, allValues, onRemoveClick }) => (
  <div className="flex gap-2">
    {values.map(value => (
      <SelectedValue
        key={value}
        value={value}
        label={allValues.find(val => val.id === value).name}
        onRemoveClick={onRemoveClick}
      />
    ))}
  </div>
);

const Filter = ({ value, onChange, attributes, onRemoveClick }) => {
  const selectedAttribute = useMemo(
    () => attributes.find(attribute => attribute.id === value?.attribute),
    [attributes, value],
  );

  const selectedValues = value?.values || [];
  const handleAttributeChange = attribute => {
    onChange({ attribute, values: [] });
  };
  const handleValueChange = newValue => {
    const prev = value?.values ?? [];
    onChange({
      ...value,
      values: prev.includes(newValue) ? prev.filter(value => value !== newValue) : [...prev, newValue],
    });
  };
  const handleRemoveValueClick = (e, removeValue) => {
    e.stopPropagation();
    const prev = value?.values ?? [];
    onChange({
      ...value,
      values: prev.filter(value => value !== removeValue),
    });
  };

  return (
    <div className="inline-flex items-center gap-3 flex-nowrap rounded-md bg-neutral-fade6 text-neutral-fade1 text-base pl-3">
      <CustomListbox
        className="flex-grow flex-shrink-0"
        value={value?.attribute}
        onChange={handleAttributeChange}
        label={value?.attribute ? selectedAttribute.name : <Placeholder>Select attribute</Placeholder>}
      >
        {attributes.map(attribute => (
          <Option key={attribute.id} value={attribute.id} label={attribute.name} />
        ))}
      </CustomListbox>
      <span className="font-semibold">{selectedValues.length > 1 ? "IN" : "="}</span>
      <CustomListbox
        className="flex-grow flex-shrink-0"
        value={selectedValues}
        onChange={handleValueChange}
        label={
          selectedValues.length ? (
            <SelectedValues
              values={selectedValues}
              allValues={selectedAttribute?.values || []}
              onRemoveClick={handleRemoveValueClick}
            />
          ) : (
            <Placeholder>Select value</Placeholder>
          )
        }
      >
        {(selectedAttribute?.values ?? []).map(attributeValue => (
          <Option
            key={attributeValue.id}
            value={attributeValue.id}
            label={attributeValue.name}
            forceSelected={selectedValues.includes(attributeValue.id)}
          />
        ))}
      </CustomListbox>
      <button
        className="pr-2 text-neutral-fade2 hover:text-neutral-fade1 transition-colors duration-200"
        onClick={onRemoveClick}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
export default Filter;
