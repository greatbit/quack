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
      className={clsx("border-2 rounded-md w-6 h-6 flex-shrink-0 relative", focusClasses, className, {
        "opacity-60": disabled,
      })}
      onClick={disabled ? undefined : onClick}
      {...other}
    >
      <svg
        viewBox="0 0 24 24"
        className={clsx("w-6 h-6 fill-current absolute top-0 left-0 duration-200 transition-opacity", {
          "opacity-0": !indeterminate,
        })}
      >
        <rect fill="current" width="16" height="16" x="2" y="2" rx="3" ry="3"></rect>
      </svg>

      <CheckIcon
        className={clsx(
          "w-5 h-5 stroke-current block duration-200 transition-opacity absolute top-0 left-0",
          iconClassName,
          {
            "opacity-0": !checked,
          },
        )}
      />
    </button>
  ),
);

export default Checkbox;
