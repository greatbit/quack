import clsx from "clsx";
import { MouseEvent, useMemo } from "react";
import Button from "../components/ui/Button";
import { FilterValue } from "../components/ui/Attribute";
import Attributes from "../components/ui/Attributes";
import { inputBackgroundClasses } from "../components/ui/input";
import Listbox from "../components/ui/ListBox";
import SelectedValues from "../components/ui/SelectedValues";
import { captionClasses } from "../components/ui/typography";
import { ExistingAttribute, ExistingAttributeFilter, FakeAttribute, isExistingAttribute } from "../domain";

export type TestCasesFiltersProps = {
  projectAttributes: (FakeAttribute | ExistingAttribute)[];
  groups: string[];
  filters: FilterValue[];
  disabled?: boolean;
  onChangeGroups: (value: string[]) => void;
  onChangeFilters: (value: (FilterValue | ExistingAttributeFilter)[]) => void;
  showSave?: boolean;
  onSaveSuiteClick?: () => void;
};

const TestCasesFilter = ({
  projectAttributes,
  groups,
  filters,
  onChangeGroups,
  onChangeFilters,
  onSaveSuiteClick,
  showSave,
  disabled,
}: TestCasesFiltersProps) => {
  const handleRemoveGroupClick = (e: MouseEvent, value: string) => {
    e.stopPropagation();
    onChangeGroups(groups.filter(group => group !== value));
  };
  const handleChangeGroups = (value: string) => {
    onChangeGroups(groups.includes(value) ? groups.filter(item => item !== value) : [...groups, value]);
  };
  const projectAttributesToGroupBy = useMemo(() => projectAttributes.filter(isExistingAttribute), [projectAttributes]);
  return (
    <div className="bg-white gap-3 p-5 ml-8 mr-8 mb-8 border">
      <div className={clsx("pb-1", captionClasses)}>Grouping</div>
      <div className="flex min-w">
        {projectAttributes.length > 0 && (
          <Listbox
            disabled={disabled}
            className={inputBackgroundClasses}
            value={groups as any}
            onChange={handleChangeGroups}
            label={
              groups.length ? (
                <SelectedValues onRemoveClick={handleRemoveGroupClick} values={groups} allValues={projectAttributes} />
              ) : (
                <Listbox.Placeholder>Select grouping</Listbox.Placeholder>
              )
            }
          >
            {projectAttributesToGroupBy.map(attribute => (
              <Listbox.Option key={attribute.id} value={attribute.id} forceSelected={groups.includes(attribute.id)}>
                {attribute.name}
              </Listbox.Option>
            ))}
          </Listbox>
        )}
        {showSave && (
          <div className="flex-grow flex justify-end gap-3">
            <Button.Transparent onClick={onSaveSuiteClick}>Save as suite</Button.Transparent>
          </div>
        )}
      </div>
      <div className={clsx("pb-1 pt-5", captionClasses)}>Attributes</div>
      <Attributes
        disabled={disabled}
        attributes={projectAttributes}
        value={filters}
        onChange={onChangeFilters}
        addLinkContent="Add filter"
        useInLabelling
      />
    </div>
  );
};

export default TestCasesFilter;
