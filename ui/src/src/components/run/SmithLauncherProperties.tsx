import clsx from "clsx";
import { useFormikContext } from "formik";
import { SmithLauncherProperties } from "../../domain";
import FieldError from "../ui/FieldError";
import TextInput from "../ui/TextInput";
import { captionClasses } from "../ui/typography";
import { FormValues } from "./Form";

const SmithLauncherPropertiesComponent = () => {
  const { values, handleChange, errors } = useFormikContext<FormValues>();
  const properties = values.properties as SmithLauncherProperties | undefined;
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
        value={properties?.apiEnpoint}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.apiEndpoint}</FieldError>

      <label htmlFor="properties.resultsArn" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        Results Arn
      </label>
      <TextInput
        name="properties.resultsArn"
        className="block w-full"
        placeholder="Results Arn"
        value={properties?.resultsArn}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.resultsArn}</FieldError>

      <label htmlFor="properties.s3Arn" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        S3 Arn
      </label>
      <TextInput
        name="properties.s3Arn"
        className="block w-full"
        placeholder="S3 Arn"
        value={properties?.s3Arn}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.s3Arn}</FieldError>

      <label htmlFor="properties.awsAccountId" className={clsx("block mb-2 font-medium mt-8", captionClasses)}>
        AWS Account ID
      </label>
      <TextInput
        name="properties.awsAccountId"
        className="block w-full"
        placeholder="AWS Account ID"
        value={properties?.awsAccountId}
        onChange={handleChange}
      />
      <FieldError>{propertiesErrors?.awsAccountIdw}</FieldError>

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
export default SmithLauncherPropertiesComponent;
