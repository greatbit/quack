import { Formik } from "formik";
import { OKCancelFooter } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import * as Yup from "yup";
import FieldError from "../ui/FieldError";

const schema = Yup.object().shape({
  name: Yup.string().required("Please give this suite a name"),
});

const Form = ({ initialValues, onSubmit, onCancel, ...other }) => (
  <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
    {({ values, errors, handleSubmit, handleChange, handleBlur }) => (
      <form onSubmit={handleSubmit} {...other}>
        <h3 className="uppercase text-base text-neutral-fade2 mt-3 mb-5">Save a new test case</h3>
        <p className="text-base text-neutral mb-4">
          Your new test suite requires a name. Please choose something meaningful and easy to remember.
        </p>
        <label htmlFor="name" className="block uppercase font-medium text-neutral-fade2 mb-2">
          Suite name
        </label>
        <TextInput
          name="name"
          className="block w-full"
          placeholder="Suite name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldError>{errors.name}</FieldError>
        <OKCancelFooter OKText="Save" type="submit" onCancelClick={onCancel} className="pt-8    " />
      </form>
    )}
  </Formik>
);

export default Form;
