//

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import moment from "moment";

export const RegexMobile = RegExp("^[0-9]+$");

export const TransformLower = ({ value }) => (value ? String(value).toLowerCase().trim() : value);

export const TransformDate = ({ value }) => (value ? moment(value).format() : value);

export function EqualTo(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EqualToConstraint,
    });
  };
}
@ValidatorConstraint({ name: "EqualTo" })
export class EqualToConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: string[] = args.constraints;
    return `${constraintProperty.replace("_", " ")} and ${args.property.replace("_", " ")} does not match`;
  }
}
