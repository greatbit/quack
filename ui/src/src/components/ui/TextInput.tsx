import clsx from "clsx";
import {
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { iconClasses } from "./Button";
import { focusClasses, focusWithinClasses, suppressFocusClasses } from "./focus";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import XIcon from "@heroicons/react/solid/XIcon";

import { inputBorderClasses, inputClasses, inputLayoutClasses, paddingClasses } from "./input";

const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...other }: InputHTMLAttributes<HTMLInputElement>, ref) => (
    <input type={type} {...other} className={clsx(className, inputClasses, paddingClasses)} ref={ref} />
  ),
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...other }, ref) => (
    <textarea className={clsx(className, inputClasses, paddingClasses, "pt-2 pb-2")} {...other} ref={ref} />
  ),
);

export type OKCancelTextInputProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange: (value: string) => void;
  onOKClick: (e: MouseEvent | KeyboardEvent) => void;
  onCancelClick: (e: MouseEvent | KeyboardEvent) => void;
};

export const OKCancelTextInput = ({
  value,
  onChange,
  onOKClick,
  onCancelClick,
  className,
  ...other
}: OKCancelTextInputProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onOKClick?.(e);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancelClick?.(e);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div
      className={clsx(
        className,
        "flex",
        "gap-2",
        "items-center",
        "bg-white",
        inputBorderClasses,
        inputLayoutClasses,
        paddingClasses,
        focusWithinClasses,
      )}
      {...other}
    >
      <input
        className={clsx(suppressFocusClasses, "flex-grow")}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <button onClick={onOKClick} className={clsx(iconClasses, focusClasses, "rounded-md")}>
        <CheckIcon className="w-5 h-5" />
      </button>
      <button onClick={onCancelClick} className={clsx(iconClasses, focusClasses, "rounded-md")}>
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TextInput;
