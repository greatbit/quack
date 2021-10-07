import { useRef } from "react";
import { ExistingLaunchConfig } from "../../domain";
import Dialog from "../ui/Dialog";
import Form, { FormValues } from "./Form";

export type RunDialogProps = {
  onCancel: VoidFunction;
  onSubmit: (values: FormValues) => void;
  environments: string[];
  launcherConfigs: ExistingLaunchConfig[];
};

const RunDialog = ({ onCancel, onSubmit, environments, launcherConfigs, ...other }: RunDialogProps) => {
  const firstElementRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open onClose={onCancel} className="max-w-xl w-full" onOverlayClick={onCancel} {...other}>
      <Dialog.Close onClick={onCancel} />
      <Form
        initialValues={{
          environments: [],
          body: "",
          endpoint: "",
          headers: "",
          launcherID: undefined,
          method: "GET",
          name: "",
          timeout: undefined,
        }}
        onSubmit={onSubmit}
        onCancel={onCancel}
        className="p-8"
        initialFocus={firstElementRef}
        environments={environments}
        launcherConfigs={launcherConfigs}
      />
    </Dialog>
  );
};

export default RunDialog;
