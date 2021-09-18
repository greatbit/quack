import { useState } from "react";
import { OKCancelTextInput } from "../components/ui/TextInput";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import clsx from "clsx";
import { iconClasses } from "../components/ui/Button";

const SuiteHeader = ({ name, onChange, ...other }) => {
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
        <h1 className="flex items-center text-neutral text font-semibold text-lg gap-2 p-0 m-0">
          {name}
          <button onClick={() => setIsEditing(true)} className={clsx(iconClasses, iconClasses)}>
            <PencilIcon className="w-5 h-5" />
          </button>
        </h1>
      )}
    </div>
  );
};

export default SuiteHeader;
