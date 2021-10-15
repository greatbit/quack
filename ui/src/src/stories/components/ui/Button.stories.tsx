import Button from "../../../components/ui/Button";

export default {
  component: Button,
  title: "components/ui/Button",
  args: {
    children: "Click me",
  },
  // parameters: { actions: { argTypesRegex: "^on.*" } },
  argTypes: { onClick: { action: true } },
};

export const Default = (args: any) => <Button {...args} />;
export const Primary = (args: any) => <Button.Primary {...args} />;
export const Link = (args: any) => <Button.Link {...args} />;
