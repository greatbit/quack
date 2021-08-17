import Dialog from "../ui/Dialog";
import Form from "./Form";

const SuiteDialog = ({ initialValues, onCancel, onSubmit, ...other }) => (
  <Dialog open onClose={onCancel} className="max-w-xl w-100" {...other}>
    <Dialog.Close onClick={onCancel} />
    <Form initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} className="p-8" />
  </Dialog>
);

export default SuiteDialog;
