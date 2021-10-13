import clsx from "clsx";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { RequestLauncherProperties } from "../../domain";
import { Listbox } from "../ui";
import FieldError from "../ui/FieldError";
import TextInput, { Textarea } from "../ui/TextInput";
import { captionClasses } from "../ui/typography";
import { FormValues } from "./Form";

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

const RequestLauncherPropertiesComponent = () => {
  const methods = useMethods();
  const { values, handleChange, errors, setFieldValue } = useFormikContext<FormValues>();
  const properties = values.properties as RequestLauncherProperties | undefined;
  const propertiesErrors = errors.properties ?? ({} as any);
  return (
    <>
      <label htmlFor="properties.endpoint" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Endpoint
      </label>
      <TextInput
        name="properties.endpoint"
        className="block w-full"
        placeholder="Endpoint"
        value={properties?.endpoint}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.endpoint}</FieldError>

      <label htmlFor="properties.requestType" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        HTTP Method
      </label>
      <Listbox
        value={properties?.requestType}
        onChange={value => setFieldValue("properties.requestType", value)}
        label={
          methods.find(method => method.id === properties?.requestType)?.name || (
            <Listbox.Placeholder>Select HTTP method</Listbox.Placeholder>
          )
        }
      >
        {methods.map(method => (
          <Listbox.Option value={method.id} key={method.id}>
            {method.name}
          </Listbox.Option>
        ))}
      </Listbox>
      <FieldError>{propertiesErrors.requestType}</FieldError>

      <label htmlFor="properties.requestHeaders" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        HTTP Headers
      </label>
      <Textarea
        name="properties.requestHeaders"
        className="block w-full"
        placeholder="Headers"
        value={properties?.requestHeaders}
        onChange={handleChange}
        rows={7}
      />
      <FieldError>{propertiesErrors.requestHeaders}</FieldError>

      <label htmlFor="properties.requestBody" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Request body
      </label>
      <Textarea
        name="properties.requestBody"
        className="block w-full"
        placeholder="Body"
        value={properties?.requestBody}
        onChange={handleChange}
        rows={7}
      />
      <FieldError>{propertiesErrors?.requestBody}</FieldError>

      <label htmlFor="properties.timeout" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Timeout
      </label>
      <TextInput
        name="properties.timeout"
        type="number"
        className="block w-full"
        placeholder="Timeout"
        value={properties?.timeout}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.timeout}</FieldError>
    </>
  );
};

export default RequestLauncherPropertiesComponent;
