import parseCsv from './utils/parse-csv';
import { FormBuilderData, FormType } from './types';
import { GenericObjectType, RJSFSchema, UiSchema } from '@rjsf/utils';

const headerMapping = {
  id: 'id',
  question: 'Question',
  type: 'Type',
  options: 'Options',
  required: 'required',
  disclosureId: 'disclosureId',
  description: 'description',
  placeholder: 'placeholder',
};

export async function getFormBuilderData(): Promise<FormBuilderData[]> {
  const data: FormBuilderData[] = (
    await parseCsv('formdata.csv', headerMapping)
  )
    .filter((row) => row.id)
    .map((row) => {
      console.log('row: ', row);
      return {
        id: row.id || '',
        question: row.question || '',
        type: FormType[(row.type || 'unkown') as keyof typeof FormType],
        options:
          (row.options && row.options?.split('|').map((o) => o.trim())) || [],
        required: row.required?.toLocaleLowerCase() === 'true',
        disclosureId: row.disclosureId || '',
        description: row.description,
        placeholder: row.placeholder,
      } as unknown as FormBuilderData;
    });
  return data;
}

function getOptionsType(options: string[]): 'string' | 'number' {
  return options.every((option) => !isNaN(Number(option)))
    ? 'number'
    : 'string';
}

function typeToRjsType(type: FormType, options: string[]): string {
  switch (type) {
    case FormType.TextArea:
      return 'string';
    case FormType.String:
      return 'string';
    case FormType.Number:
      return 'number';
    case FormType.Integer:
      return 'integer';
    case FormType.Select:
      return getOptionsType(options);
    case FormType.MultiSelect:
      return 'array';
    case FormType.Radio:
      return 'string';
    default:
      return 'string';
  }
}

export function generateFormJson(data: FormBuilderData[]): {
  schema: RJSFSchema;
  uiSchema: UiSchema;
} {
  const order = data.map((row) => row.id);

  const schema: RJSFSchema = {
    title: 'Valumia',
    description: 'Valumia is awesome',
    type: 'object',
    required: data.filter((row) => row.required).map((row) => row.id),
    properties: data.reduce((acc: GenericObjectType, row) => {
      acc[row.id] = {
        type: typeToRjsType(row.type, row.options),
        title: row.question,
        default: row.default,
      };
      if (row.options.length && row.type !== FormType.MultiSelect) {
        acc[row.id].enum = row.options;
      } else if (row.options.length) {
        acc[row.id].uniqueItems = true;
        acc[row.id].items = {
          type: getOptionsType(row.options),
          enum: row.options,
        };
      }
      return acc;
    }, {}),
  };

  const uiSchema: UiSchema = data.reduce((acc, row) => {
    if (row.description || row.placeholder || row.type === FormType.Radio) {
      acc[row.id] = {};
      if (row.description) {
        acc[row.id]['ui:description'] = row.description;
      }
      if (row.placeholder) {
        acc[row.id]['ui:placeholder'] = row.placeholder;
      }
      if (row.type === FormType.TextArea) {
        acc[row.id]['ui:widget'] = 'textarea';
      }
      //   if (row.type === FormType.Radio) {
      //     acc[row.id]['ui:widget'] = 'checkboxes';
      //   }
    }
    return acc;
  }, {} as UiSchema);

  uiSchema['ui:order'] = order;

  return { schema, uiSchema };
}
