import clsx from "clsx";
import { useFormikContext } from "formik";
import { LikenLauncherProperties } from "../../domain";
import FieldError from "../ui/FieldError";
import TextInput from "../ui/TextInput";
import { captionClasses } from "../ui/typography";
import { FormValues } from "./Form";

const LikenLauncherPropertiesComponent = () => {
  const { values, handleChange, errors } = useFormikContext<FormValues>();
  const properties = values.properties as LikenLauncherProperties | undefined;
  const propertiesErrors = errors.properties as any;
  return (
    <>
      <label htmlFor="properties.apiEndpoint" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Endpoint
      </label>
      <TextInput
        name="properties.apiEndpoint"
        className="block w-full"
        placeholder="Endpoint"
        value={properties?.apiEndpoint}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.apiEndpoint}</FieldError>

      <label htmlFor="properties.frontendEndpoint" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Frontend Endpoint
      </label>
      <TextInput
        name="properties.frontendEndpoint"
        className="block w-full"
        placeholder="Frontend Endpoint"
        value={properties?.frontendEndpoint}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.frontendEndpoint}</FieldError>

      <label htmlFor="properties.placeholders" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Comma separated placeholders
      </label>
      <TextInput
        name="properties.placeholders"
        className="block w-full"
        placeholder="Placeholders"
        value={properties?.placeholders}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.placeholders}</FieldError>

      <label htmlFor="properties.prefixA" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Prefix A
      </label>
      <TextInput
        name="properties.prefixA"
        className="block w-full"
        placeholder="Placeholder"
        value={properties?.prefixA}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.prefixA}</FieldError>

      <label htmlFor="properties.urlA" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        URL A
      </label>
      <TextInput
        name="properties.urlA"
        className="block w-full"
        placeholder="Placeholder"
        value={properties?.urlA}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.urlA}</FieldError>

      <label htmlFor="properties.prefixB" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Prefix B
      </label>
      <TextInput
        name="properties.prefixB"
        className="block w-full"
        placeholder="Placeholder"
        value={properties?.prefixB}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.prefixB}</FieldError>

      <label htmlFor="properties.urlA" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        URL B
      </label>
      <TextInput
        name="properties.urlB"
        className="block w-full"
        placeholder="Placeholder"
        value={properties?.urlB}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.urlB}</FieldError>

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

export default LikenLauncherPropertiesComponent;
