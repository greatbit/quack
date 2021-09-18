import { Formik } from "formik";
import { OKCancelFooter } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import * as Yup from "yup";
import FieldError from "../ui/FieldError";
import clsx from "clsx";
import { captionClasses } from "../ui/typography";
import { FormHTMLAttributes, Ref } from "react";
const schema = Yup.object().shape({
  name: Yup.string().required("Please give this suite a name"),
});

export type FormValues = {
  name: string;
};
export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  initialValues: FormValues;
  initialFocus: Ref<HTMLInputElement>;
  onSubmit: (values: FormValues) => void;
  onCancel: VoidFunction;
};
const Form = ({ initialValues, initialFocus, onSubmit, onCancel, ...other }: FormProps) => (
  <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
    {({ values, errors, handleSubmit, handleChange, handleBlur }) => (
      <form onSubmit={handleSubmit} {...other}>
        <h3 className="uppercase font-medium text-base text-neutral-fade2 mt-3 mb-5">Save a new test case</h3>
        <p className="text-base text-neutral mb-4">
          Your new test suite requires a name. Please choose something meaningful and easy to remember.
        </p>
        <label htmlFor="name" className={clsx("block mb-2", captionClasses)}>
          Suite name
        </label>
        <TextInput
          ref={initialFocus}
          name="name"
          className="block w-full"
          placeholder="Suite name"
          value={values.name}
          onChange={handleChange}
        />
        <FieldError>{errors.name}</FieldError>
        <OKCancelFooter OKText="Save" OKType="submit" onCancelClick={onCancel} className="pt-8    " />
      </form>
    )}
  </Formik>
);

export default Form;
