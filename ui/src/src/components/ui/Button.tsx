import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { focusClasses } from "./focus";

export const baseClasses = "duration-200 font-medium";

const Button = ({ className, ...other }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={clsx(className, baseClasses)} {...other} />
);

export const primaryClasses = "relative text-base h-11 bg-primary text-white rounded-md hover:bg-primary-hover";
export const paddingClasses = "pl-4 pr-4";

const Primary = ({ className, ...other }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={clsx(className, baseClasses, primaryClasses, focusClasses)} {...other} />
);

const transparentClasses = "text-base h-11 b text-neutral-fade1 rounded-md hover:bg-neutral-fade6 border";
export const Transparent = ({ className, ...other }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={clsx(className, baseClasses, transparentClasses, paddingClasses)} {...other} />
);

Button.Transparent = Transparent;

export const linkTextClasses = "text-base";
export const linkClasses = "pl-3 pr-3 rounded-md";
export const linkNeutralClasses = "text-neutral-fade2 hover:text-neutral";
export const linkPrimaryClasses = "text-primary hover:text-primary-hover";
const Link = ({ className, ...other }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={clsx(className, baseClasses, linkTextClasses, focusClasses, linkClasses)} {...other} />
);

export const iconClasses = "text-neutral-fade1 opacity-70 hover:opacity-100 transition-colors";
Button.Primary = Primary;
Button.Link = Link;

export default Button;
