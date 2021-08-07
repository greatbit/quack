// Button.stories.js | Button.stories.jsx

import React, { useState } from "react";

import Filter, { SelectedValues as SelectedValuesComponent } from "../../../components/ui/Filter";

export default {
  component: Filter,
  title: "components/ui/Filter",
};

const attributes = [
  {
    id: "foo",
    name: "foo",
    values: [
      { id: "foo-value-1", name: "Foo value 1" },
      { id: "foo-value-2", name: "Foo value 2" },
    ],
  },
  {
    id: "bar",
    name: "Bar",
    values: [
      { id: "bar-value-1", name: "Bar value 1" },
      { id: "var-value-2", name: "Bar value 2" },
    ],
  },
];
const allValues = attributes[0].values;

export const Primary = () => {
  const [state, setState] = useState({ attribute: undefined, values: [] });
  return <Filter attributes={attributes} value={state} onChange={setState}></Filter>;
};

export const SelectedValues = () => {
  const selectedValues = allValues.map(val => val.id);
  return (
    <div className="bg-neutral-fade4 flex p-3">
      <SelectedValuesComponent allValues={allValues} values={selectedValues} />
    </div>
  );
};
