import { Formik } from "formik";
import { OKCancelFooter } from "../ui/Dialog";
import TextInput, { Textarea } from "../ui/TextInput";
import * as Yup from "yup";
import FieldError from "../ui/FieldError";
import clsx from "clsx";
import { captionClasses } from "../ui/typography";
import { FormHTMLAttributes, Ref, useMemo } from "react";
import { ExistingLaunchConfig } from "../../domain";
import { Listbox } from "../ui";
import { Option } from "../ui/ListBox";
import SelectedValues from "../ui/SelectedValues";

const schema = Yup.object().shape({
  name: Yup.string().required("Please give this run a name"),
  environments: Yup.array().min(1, "Please select at least one environment"),
  endpoint: Yup.string().required("Please enter an endpoint"),
  method: Yup.string().required("Please seelct an HTTP method"),
  timeout: Yup.number().positive("Please enter a positive value"),
});

export type FormValues = {
  name: string;
  environments: string[];
  launcherID: string | undefined;
  endpoint: string | undefined;
  method: string | undefined;
  body: string | undefined;
  headers: string | undefined;
  timeout: string | undefined;
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  initialValues: FormValues;
  initialFocus?: Ref<HTMLInputElement>;
  onSubmit: (values: FormValues) => void;
  onCancel: VoidFunction;
  launcherConfigs: ExistingLaunchConfig[];
  environments: string[];
};

const useMethods = () =>
  useMemo(
    () => [
      {
        id: "GET",
        name: "GET",
      },
      {
        id: "POST",
        name: "POST",
      },
      {
        id: "PUT",
        name: "PUT",
      },
    ],
    [],
  );

const Form = ({
  initialValues,
  initialFocus,
  onSubmit,
  onCancel,
  launcherConfigs,
  environments,
  ...other
}: FormProps) => {
  const environmentValues = useMemo(() => environments.map(env => ({ id: env, name: env })), [environments]);
  const methods = useMethods();
  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
      {({ values, errors, handleSubmit, handleChange, handleBlur, setFieldValue, setValues }) => (
        <form onSubmit={handleSubmit} {...other}>
          <h3 className="uppercase font-medium text-base text-neutral-fade2 mt-3 mb-5">Create a new test case</h3>
          <label htmlFor="name" className={clsx("block mb-2 font-medium", captionClasses)}>
            Test case name
          </label>
          <TextInput
            ref={initialFocus}
            name="name"
            className="block w-full"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
          />
          <FieldError>{errors.name}</FieldError>

          <label className={clsx("block mb-2 font-medium mt-8", captionClasses)}>Environments</label>
          <Listbox
            value={values.environments}
            onChange={value =>
              setFieldValue(
                "environments",
                values.environments.includes(value as any)
                  ? values.environments.filter(item => item !== (value as any))
                  : [...values.environments, value as any],
              )
            }
            label={
              values.environments?.length ? (
                <SelectedValues
                  values={values.environments}
                  allValues={environmentValues}
                  onRemoveClick={(e, id) => {
                    e.stopPropagation();
                    setFieldValue(
                      "environments",
                      values.environments.filter(item => item !== id),
                    );
                  }}
                />
              ) : (
                <Listbox.Placeholder>Select environments</Listbox.Placeholder>
              )
            }
          >
            {environments.map(env => (
              <Option value={env} key={env}>
                {env}
              </Option>
            ))}
          </Listbox>
          <FieldError>{errors.environments}</FieldError>

          <label className={clsx("block mb-2 font-medium mt-8", captionClasses)}>Launcher config</label>
          <Listbox
            value={values.launcherID}
            onChange={value => {
              const props = launcherConfigs.find(item => item.id === value)!.properties;
              setValues({
                ...values,
                launcherID: value,
                body: props.requestBody,
                endpoint: props.endpoint,
                headers: props.requestHeaders,
                method: props.requestType,
                timeout: props.timeout,
              });
            }}
            label={
              launcherConfigs.find(config => config.id === values.launcherID)?.name || (
                <Listbox.Placeholder>Select launch config</Listbox.Placeholder>
              )
            }
          >
            {launcherConfigs.map(config => (
              <Option value={config.id} key={config.id}>
                {config.name}
              </Option>
            ))}
          </Listbox>

          <label htmlFor="endpoint" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
            Endpoint
          </label>
          <TextInput
            name="endpoint"
            className="block w-full"
            placeholder="Endpoint"
            value={values.endpoint}
            onChange={handleChange}
          />
          <FieldError>{errors.endpoint}</FieldError>

          <label htmlFor="type" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
            HTTP Method
          </label>
          <Listbox
            value={values.method}
            onChange={value => setFieldValue("method", value)}
            label={
              methods.find(method => method.id === values.method)?.name || (
                <Listbox.Placeholder>Select HTTP method</Listbox.Placeholder>
              )
            }
          >
            {methods.map(method => (
              <Option value={method.id} key={method.id}>
                {method.name}
              </Option>
            ))}
          </Listbox>
          <FieldError>{errors.method}</FieldError>

          <label htmlFor="headers" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
            HTTP Headers
          </label>
          <Textarea
            name="headers"
            className="block w-full"
            placeholder="Headers"
            value={values.headers}
            onChange={handleChange}
            rows={7}
          />
          <FieldError>{errors.headers}</FieldError>

          <label htmlFor="body" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
            Request body
          </label>
          <Textarea
            name="body"
            className="block w-full"
            placeholder="Body"
            value={values.body}
            onChange={handleChange}
            rows={7}
          />
          <FieldError>{errors.body}</FieldError>

          <label htmlFor="timeout" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
            Timeout
          </label>
          <TextInput
            name="timeout"
            type="number"
            className="block w-full"
            placeholder="Timeout"
            value={values.timeout}
            onChange={handleChange}
          />
          <FieldError>{errors.timeout}</FieldError>

          <OKCancelFooter OKText="Save" OKType="submit" onCancelClick={onCancel} className="pt-8" />
        </form>
      )}
    </Formik>
  );
};

export default Form;
