import { Formik } from "formik";
import { OKCancelFooter } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import * as Yup from "yup";
import FieldError from "../ui/FieldError";
import clsx from "clsx";
import { captionClasses } from "../ui/typography";
import { ComponentType, FormHTMLAttributes, Ref, useMemo } from "react";
import { ExistingLaunchConfig, LauncherId, NewLaunchConfig } from "../../domain";
import { Listbox } from "../ui";
import { Option } from "../ui/ListBox";
import SelectedValues from "../ui/SelectedValues";
import RequestLauncherProperties from "./RequestLauncherProperties";
import LikenLauncherProperties from "./LikenLauncherProperties";
import SmithLauncherProperties from "./SmithLauncherProperties";

const laucherIdToPropertiesComponentMap: Record<LauncherId, ComponentType<{}>> = {
  "request-launcher": RequestLauncherProperties,
  "liken-launcher": LikenLauncherProperties,
  "smith-launcher": SmithLauncherProperties,
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please give this run a name"),
  environments: Yup.array().min(1, "Please select at least one environment"),
  launcherUuid: Yup.string().required("Please select a launcher config"),
  properties: Yup.object()
    .when("launcherId", {
      is: "request-launcher",
      then: Yup.object({
        endpoint: Yup.string().required("Please enter an endpoint"),
        requestType: Yup.string().required("Please seelct an HTTP method"),
        timeout: Yup.number().positive("Please enter a positive value"),
      }),
    })
    .when("launcherId", {
      is: "liken-launcher",
      then: Yup.object({
        apiEndpoint: Yup.string().required("Please enter an endpoint"),
        frontendEndpoint: Yup.string().required("Please enter an endpoint"),
      }),
    })
    .when("launcherId", {
      is: "smith-launcher",
      then: Yup.object({
        apiEndpoint: Yup.string().required("Please enter an endpoint"),
      }),
    }),
});

export type FormValues = Partial<Omit<NewLaunchConfig, "environments">> & Pick<NewLaunchConfig, "environments">;

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  initialValues: FormValues;
  initialFocus?: Ref<HTMLInputElement>;
  onSubmit: (values: FormValues) => void;
  onCancel: VoidFunction;
  launcherConfigs: ExistingLaunchConfig[];
  environments: string[];
};

export type PropertiesComponentProps = {
  launcherId: LauncherId;
};

const PropertiesComponent = ({ launcherId }: PropertiesComponentProps) => {
  const Component = laucherIdToPropertiesComponentMap[launcherId];
  return Component ? <Component /> : null;
};

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
  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
      {({ values, errors, handleSubmit, handleChange, setFieldValue, setValues }) => (
        <form onSubmit={handleSubmit} {...other}>
          <h3 className="mt-3 mb-5 text-base font-medium uppercase text-neutral-fade2">Run selected testcases</h3>
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
            value={values.launcherId}
            onChange={(value: any) => {
              console.info("setting", value);

              const config = launcherConfigs.find(item => item.uuid === value)!;
              console.info(config);
              setValues({
                ...values,
                launcherId: config.launcherId,
                launcherUuid: config.uuid,
                properties: config.properties,
              });
            }}
            label={
              launcherConfigs.find(config => config.uuid === values.launcherUuid)?.name || (
                <Listbox.Placeholder>Select launch config</Listbox.Placeholder>
              )
            }
          >
            {launcherConfigs.map(config => (
              <Option value={config.uuid} key={config.uuid}>
                {config.name}
              </Option>
            ))}
          </Listbox>
          <FieldError>{errors.launcherUuid}</FieldError>
          {values.launcherId && <PropertiesComponent launcherId={values.launcherId} />}
          <OKCancelFooter OKText="Save" OKType="submit" onCancelClick={onCancel} className="pt-8" />
        </form>
      )}
    </Formik>
  );
};

export default Form;
