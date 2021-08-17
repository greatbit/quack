import clsx from "clsx";

import { inputClasses } from "./input";
const TextInput = ({ className, type = "text", ...other }) => (
  <input type={type} {...other} className={clsx(className, inputClasses, "pl-4 pr-4")} />
);

export default TextInput;
