import { ReferenceObject, SchemaObject } from 'openapi3-ts';

export function extractParameterEnumValues(
  raw: ReferenceObject | SchemaObject
) {
  if ('enum' in raw && Array.isArray(raw.enum)) {
    return raw.enum.map((val) => {
      return `${val}`;
    });
  }
  return [];
}
