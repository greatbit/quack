import { useRef } from "react";
import { ExistingAttribute, FakeAttribute } from "../../domain";
import Dialog from "../ui/Dialog";
import Form, { FormValues } from "./Form";

export type SuiteDialogProps = {
  onCancel: VoidFunction;
  onSubmit: (values: FormValues) => void;
  attributes: (FakeAttribute | ExistingAttribute)[];
};

const TestCaseDialog = ({ onCancel, onSubmit, attributes, ...other }: SuiteDialogProps) => {
  const firstElementRef = useRef<HTMLInputElement>(null);
  const initialValues: FormValues = {
    attributes: [],
    name: "",
    description: "",
  };
  return (
    <Dialog open onClose={onCancel} className="max-w-xl w-full" onOverlayClick={onCancel} {...other}>
      <Dialog.Close onClick={onCancel} />
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        className="p-8"
        initialFocus={firstElementRef}
        attributes={attributes}
      />
    </Dialog>
  );
};

export default TestCaseDialog;
