import Checkbox from "../../../components/ui/Checkbox";

export default {
  component: Checkbox,
  title: "components/ui/Checkbox",
  args: {
    children: "",
  },
  argTypes: { onClick: { action: true } },
};

export const Default = (args: any) => <Checkbox {...args} />;
export const Checked = (args: any) => <Checkbox {...args} checked />;
export const Indeterminate = (args: any) => <Checkbox {...args} indeterminate />;
