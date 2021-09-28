import CheckIcon from "@heroicons/react/outline/CheckIcon";
import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";
import { focusClasses } from "../../components/ui/focus";

export type CheckboxProps = HTMLAttributes<HTMLButtonElement> & {
  iconClassName?: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
};

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, indeterminate, className, onClick, iconClassName, disabled, ...other }, ref) => (
    <button
      ref={ref}
      className={clsx("border-2 rounded-md w-6 h-6", focusClasses, className, { "opacity-60": disabled })}
      onClick={disabled ? undefined : onClick}
      {...other}
    >
      {indeterminate ? (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <rect fill="current" width="16" height="16" x="4" y="4" rx="3" ry="3"></rect>
        </svg>
      ) : (
        <CheckIcon
          className={clsx("w-5 h-5 stroke-current block duration-200 transition-opacity", iconClassName, {
            "opacity-0": !checked,
          })}
        />
      )}
    </button>
  ),
);

export default Checkbox;
