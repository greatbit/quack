import clsx from "clsx";
export const baseClasses = "duration-200  transition-colors font-semibold ";
const Button = ({ className, ...other }) => <button className={clsx(className, baseClasses)} {...other} />;

export const primaryClasses = "text-base h-10 bg-primary text-white rounded-md hover:bg-primary-hover  pl-4 pr-4";
const Primary = ({ className, ...other }) => (
  <button className={clsx(className, baseClasses, primaryClasses)} {...other} />
);

export const linkClasses = "text-base text-neutral-fade1 hover:text-neutral pl-3 pr-3";
const Link = ({ className, ...other }) => <button className={clsx(className, baseClasses, linkClasses)} {...other} />;

Button.Primary = Primary;
Button.Link = Link;

export default Button;
