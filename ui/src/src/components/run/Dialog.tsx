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
    <Dialog open onClose={onCancel} className="w-full max-w-xl" onOverlayClick={onCancel} {...other}>
      <Dialog.Close onClick={onCancel} />
      <Form
        initialValues={{
          environments: [] as string[],
          launcherId: undefined,
          launcherUuid: undefined,
          name: "",
          properties: undefined,
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
