import { FunctionComponent, memo, MouseEvent, useRef } from "react";
import { ExistingTestCase } from "../../domain";
import clsx from "clsx";
import Checkbox from "../ui/Checkbox";

export type TestCaseListItemProps = {
  disabled?: boolean;
  testCase: ExistingTestCase;
  checked?: boolean;
  selected?: boolean;
  onClick?: (id: string) => void;
  onCheckboxClick?: (id: string) => void;
  level: number;
};

const TestCaseListItem: FunctionComponent<TestCaseListItemProps> = memo(
  ({ testCase, checked, disabled, selected, onClick, onCheckboxClick, level }) => {
    const checkboxRef = useRef<HTMLButtonElement>(null);
    const handleClick = (e: MouseEvent<HTMLElement>) => {
      if (checkboxRef.current?.contains(e.target as HTMLElement) || checkboxRef.current === e.target) {
        return;
      }
      onClick?.(testCase.id);
    };

    return (
      <li
        onClick={handleClick}
        className={clsx("text-base pt-3 pb-3 pl-5 pr-5 flex items-start gap-3", {
          "bg-primary text-white border-white": selected,
        })}
      >
        <Checkbox
          ref={checkboxRef}
          checked={checked}
          disabled={disabled}
          onClick={() => {
            onCheckboxClick?.(testCase.id);
          }}
          className={clsx({
            "border-neutral-fade2": !selected,
            "border-white": selected,
          })}
          iconClassName={clsx({
            "text-neutral-fade1": !selected,
          })}
          style={{ marginLeft: `${(level + 1) * 28}px` }}
        />
        <div className="pt-0">{testCase.name}</div>
      </li>
    );
  },
);

export default TestCaseListItem;
