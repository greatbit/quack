import CheckIcon from "@heroicons/react/solid/CheckIcon";
import SelectorIcon from "@heroicons/react/solid/SelectorIcon";
import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useMemo } from "react";
import SelectedValues from "./SelectedValues";

const CustomListbox = ({ label, value, onChange, children, className }) => (
  <Listbox value={value} onChange={onChange} as="div" className={clsx(className, "relative", "flex")}>
    <Listbox.Button className={clsx("flex h-10 items-center gap-2 pl-1 focus-within:outline-focus", className)}>
      <span className="flex-grow">{label}</span>
      <SelectorIcon className="w-4 h-4 text-neutral-fade2 hover:text-neutral-fade1 transition-colors duration-200" />
    </Listbox.Button>
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      className="absolute z-10 w-full min-w-max bg-white shadow-lg rounded-md overflow-hidden"
    >
      <Listbox.Options className="focus:outline-none focus-within:outline-none">{children}</Listbox.Options>
    </Transition>
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
    <div className="inline-flex items-center gap-2 flex-nowrap rounded-md bg-neutral-fade6 text-neutral-fade1 text-base pl-2">
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
      <span className="font-semibold">{selectedValues.length > 1 ? "in" : "="}</span>
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
        className="mr-2 text-neutral-fade2 hover:text-neutral-fade1 transition-colors duration-200 focus:outline-focus"
        onClick={onRemoveClick}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
export default Filter;
