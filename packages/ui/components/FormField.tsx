export type FieldKind = "text" | "email" | "number" | "select" | "date" | "toggle";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormFieldModel {
  component: "FormField";
  id: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  placeholder?: string;
  value?: string | number | boolean;
  options?: SelectOption[];
  helpText?: string;
  errorText?: string;
}

export interface FilterModel {
  id: string;
  label: string;
  field: FormFieldModel;
}

export function createFormField(input: Omit<FormFieldModel, "component" | "required"> & {
  required?: boolean;
}): FormFieldModel {
  return {
    component: "FormField",
    id: input.id,
    label: input.label,
    kind: input.kind,
    required: input.required ?? false,
    placeholder: input.placeholder,
    value: input.value,
    options: input.options,
    helpText: input.helpText,
    errorText: input.errorText
  };
}

export function createFilter(id: string, label: string, field: FormFieldModel): FilterModel {
  return { id, label, field };
}
