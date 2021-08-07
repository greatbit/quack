import XCircleIcon from "@heroicons/react/solid/XCircleIcon";

const SelectedValue = ({ value, label, onRemoveClick }) => (
  <span className="bg-neutral-fade1 rounded-md h-5 text-white text-sm flex items-center gap-2 pl-2 pr-1">
    <span>{label}</span>
    <button onClick={e => onRemoveClick(e, value)}>
      <XCircleIcon className="w-3 h-3" />
    </button>
  </span>
);

const SelectedValues = ({ values, allValues, onRemoveClick }) => (
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

export default SelectedValues;
