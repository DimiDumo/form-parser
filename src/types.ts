export enum FormType {
  TextArea = 'TextArea',
  String = 'string',
  Number = 'number',
  Integer = 'integer',
  Select = 'select',
  MultiSelect = 'MultiSelect',
  Radio = 'Radio',
}

export type FormBuilderData = {
  id: string;
  question: string;
  type: FormType;
  options: string[];
  required: boolean;
  disclosureId: string;
  description?: string;
  placeholder?: string;
  default?: string;
};
