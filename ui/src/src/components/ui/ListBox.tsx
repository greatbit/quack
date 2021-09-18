import SelectorIcon from "@heroicons/react/solid/SelectorIcon";
import { Listbox as HeadlessListBox, Transition } from "@headlessui/react";
import clsx from "clsx";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import { inputBorderClasses, inputLayoutClasses, inputTextClasses } from "./input";
import { focusClasses } from "./focus";
import { PropsWithChildren, ReactNode } from "react";

const Placeholder = ({ children }: PropsWithChildren<{}>) => <span className="text-neutral-fade2">{children}</span>;

export type BasicListboxProps<TValue> = PropsWithChildren<{
  label?: ReactNode;
  value: TValue;
  onChange: (newValue: TValue) => void;
  className?: string;
  buttonClassName?: string;
}>;

export function BasicListbox<TValue>({
  label,
  value,
  onChange,
  children,
  className,
  buttonClassName,
}: BasicListboxProps<TValue>) {
  return (
    <HeadlessListBox value={value} onChange={onChange} as="div" className={clsx(className, "relative", "flex")}>
      <HeadlessListBox.Button
        className={clsx("flex items-center gap-1", buttonClassName, inputTextClasses, inputLayoutClasses, focusClasses)}
      >
        <span className="flex-grow">{label}</span>
        <SelectorIcon className="w-4 h-4 text-neutral-fade2 hover:text-neutral-fade1 transition-colors duration-200" />
      </HeadlessListBox.Button>
      <HeadlessListBox.Options className="focus:outline-none focus-within:outline-none absolute z-10 w-full min-w-max bg-white shadow-lg rounded-md overflow-hidden">
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          {children}
        </Transition>
      </HeadlessListBox.Options>
    </HeadlessListBox>
  );
}

export type OptionProps<TValue> = PropsWithChildren<{
  value: TValue;
  forceSelected?: boolean;
}>;
export function Option<TValue>({ value, children, forceSelected }: OptionProps<TValue>) {
  return (
    <HeadlessListBox.Option value={value}>
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
          <span className={clsx({ "font-semibold": selected || forceSelected })}>{children}</span>
        </div>
      )}
    </HeadlessListBox.Option>
  );
}

BasicListbox.Option = Option;
BasicListbox.Placeholder = Placeholder;

function Listbox<TValue>({ className, ...props }: BasicListboxProps<TValue>) {
  return (
    <BasicListbox
      {...props}
      className={clsx(className, inputBorderClasses, "rounded-md focus:outline-none")}
      buttonClassName="flex-grow pr-2 pl-3 "
    />
  );
}

Listbox.Option = Option;
Listbox.Placeholder = Placeholder;
export default Listbox;
