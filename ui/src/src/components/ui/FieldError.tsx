import { PropsWithChildren } from "react";

export type FieldErrorProps = PropsWithChildren<{}>;
const FieldError = ({ children }: FieldErrorProps) =>
  children ? (
    <div className="bg-error text-white text-sm rounded-b-md p-2 pl-3 pr-3 ml-2 mr-2 relative top-0 z-0">
      {children}
    </div>
  ) : null;

export default FieldError;
