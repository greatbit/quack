import { Formik } from "formik";
import { OKCancelFooter } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import * as Yup from "yup";
import FieldError from "../ui/FieldError";
import clsx from "clsx";
import { captionClasses } from "../ui/typography";
import { FormHTMLAttributes, Ref } from "react";
import { ExistingAttribute, FakeAttribute } from "../../domain";
import Attributes from "../ui/Attributes";
import { FilterValue } from "../ui/Attribute";
const schema = Yup.object().shape({
  name: Yup.string().required("Please give this test case a name"),
});

export type FormValues = {
  name: string;
  description: string;
  attributes: FilterValue[];
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  initialValues: FormValues;
  initialFocus?: Ref<HTMLInputElement>;
  onSubmit: (values: FormValues) => void;
  onCancel: VoidFunction;
  attributes: (ExistingAttribute | FakeAttribute)[];
};

const Form = ({ initialValues, initialFocus, onSubmit, onCancel, attributes, ...other }: FormProps) => (
  <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
    {({ values, errors, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
      <form onSubmit={handleSubmit} {...other}>
        <h3 className="uppercase font-medium text-base text-neutral-fade2 mt-3 mb-5">Create a new test case</h3>
        <label htmlFor="name" className={clsx("block mb-2 font-medium", captionClasses)}>
          Test case name
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
        <label htmlFor="description" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
          Description
        </label>
        <TextInput
          name="description"
          className="block w-full"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
        />
        <label className={clsx("block mb-2 font-medium mt-8", captionClasses)}>Attributes</label>
        <Attributes
          attributes={attributes}
          value={values.attributes}
          onChange={value => setFieldValue("attributes", value)}
          addLinkContent="Add attribute"
          className="flex-col"
        />
        <OKCancelFooter OKText="Save" OKType="submit" onCancelClick={onCancel} className="pt-8" />
      </form>
    )}
  </Formik>
);

export default Form;
