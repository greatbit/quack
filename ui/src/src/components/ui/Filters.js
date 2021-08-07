import Filter from "./Filter";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";

const Filters = ({ attributes, value, onChange }) => {
  const handleFilterChange = index => newValue => onChange(value.map((filter, i) => (i === index ? newValue : filter)));
  const handleRemoveFilterClick = index => () =>
    onChange(value.map((filter, i) => (i === index ? undefined : filter)).filter(Boolean));
  const handleAddFilterClick = () => onChange([...value, { attribute: undefined, values: [] }]);
  return (
    <div className="flex flex-wrap gap-3">
      {value.map((filter, index) => (
        <Filter
          key={index}
          value={filter}
          attributes={attributes}
          onChange={handleFilterChange(index)}
          onRemoveClick={handleRemoveFilterClick(index)}
        />
      ))}
      <button
        className="flex items-center text-base text-primary gap-1 focus:outline-focus"
        onClick={handleAddFilterClick}
      >
        <PlusCircleIcon className="w-5 h-5" />
        <span>Add filter</span>
      </button>
    </div>
  );
};

export default Filters;
