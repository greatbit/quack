import { HTMLAttributes, useState } from "react";
import { OKCancelTextInput } from "../components/ui/TextInput";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import clsx from "clsx";
import { iconClasses } from "../components/ui/Button";

export type SuiteHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  name: string;
  onChange: (value: string) => void;
};

export const SuiteHeaderText = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={clsx(className, "flex items-center text-neutral text font-light text-xl gap-2 p-0 mt-0 mb-0")}
    {...props}
  >
    {children}
  </h1>
);

const SuiteHeader = ({ name, onChange, ...other }: SuiteHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);
  const handleOK = () => {
    setIsEditing(false);
    onChange(editingName);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditingName(name);
  };

  return (
    <div {...other}>
      {isEditing ? (
        <OKCancelTextInput
          value={editingName}
          onChange={setEditingName}
          onOKClick={handleOK}
          onCancelClick={handleCancel}
        />
      ) : (
        <SuiteHeaderText>
          {name}
          <button onClick={() => setIsEditing(true)} className={clsx(iconClasses, iconClasses)}>
            <PencilIcon className="w-5 h-5" />
          </button>
        </SuiteHeaderText>
      )}
    </div>
  );
};

export default SuiteHeader;
