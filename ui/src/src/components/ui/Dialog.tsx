import { Dialog as HeadlessDialog } from "@headlessui/react";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

import clsx from "clsx";
import { ButtonHTMLAttributes, EventHandler, MouseEvent, PropsWithChildren } from "react";
import { useLayoutEffect } from "react";
import Button from "./Button";
import { focusClasses } from "./focus";

export type DialogProps = PropsWithChildren<{
  className?: string;
  onOverlayClick: EventHandler<MouseEvent>;
  onClose: (b: boolean) => void;
  open: boolean;
}>;

const Dialog = ({ children, className, onOverlayClick, onClose, ...other }: DialogProps) => {
  // TODO: Remove this when we get rid of Bootstrap
  useLayoutEffect(() => {
    const root = document.getElementById("headlessui-portal-root");
    if (root && !root.className.includes("tailwind")) {
      root.className = root.className + " tailwind";
    }
  });
  return (
    <HeadlessDialog
      {...other}
      className="text-neutral z-20 inset-0 fixed flex items-center justify-center overflow-y-auto"
      onClose={onClose}
    >
      <div className="flex items-center justify-center min-h-screen">
        <HeadlessDialog.Overlay
          className="z-10 absolute opacity-80 bg-white w-screen h-screen"
          onClick={onOverlayClick}
        />
        <div className={clsx(className, "z-30 shadow-2xl bg-white rounded-xl relative")}>{children}</div>
      </div>
    </HeadlessDialog>
  );
};

const Close = ({ className, ...other }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "absolute",
      "right-5",
      "top-5 transition-colors duration-300 opacity-70 hover:opacity-100 rounded-md",
      focusClasses,
      className,
    )}
    {...other}
  >
    <XCircleIcon className="w-5 h-5" />
  </button>
);

export type OKCancelFooterProps = {
  className?: string;
  OKText?: string;
  OKType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  cancelType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  cancelText?: string;
  onOKClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onCancelClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

export const OKCancelFooter = ({
  className,
  OKText = "OK",
  OKType = "submit",
  cancelType = "button",
  cancelText = "Cancel",
  onOKClick,
  onCancelClick,
  ...other
}: OKCancelFooterProps) => (
  <div className={clsx("rounded-md flex gap-2", className)} {...other}>
    <Button.Primary onClick={onOKClick} type={OKType} className="pl-8 pr-8">
      {OKText}
    </Button.Primary>
    <Button.Link onClick={onCancelClick} type={cancelType}>
      {cancelText}
    </Button.Link>
  </div>
);

Dialog.Title = HeadlessDialog.Title;
Dialog.Overlay = HeadlessDialog.Overlay;
Dialog.Close = Close;
Dialog.OKCancelFooter = OKCancelFooter;

export default Dialog;
