import { useRef } from "react";
import Dialog from "../ui/Dialog";
import Form, { FormValues } from "./Form";

export type SuiteDialogProps = {
  initialValues: FormValues;
  onCancel: VoidFunction;
  onSubmit: (values: FormValues) => void;
};
const SuiteDialog = ({ initialValues, onCancel, onSubmit, ...other }: SuiteDialogProps) => {
  const firstElementRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open onClose={onCancel} className="max-w-xl w-100" onOverlayClick={onCancel} {...other}>
      <Dialog.Close onClick={onCancel} />
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        className="p-8"
        initialFocus={firstElementRef}
      />
    </Dialog>
  );
};

export default SuiteDialog;
