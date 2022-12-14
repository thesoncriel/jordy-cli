import { SchemaObject, ReferenceObject } from 'openapi3-ts';
import { IntermediatePropertyCheckResultDto } from '../types';

export function getRefWhenExists(schema: SchemaObject | ReferenceObject) {
  if ('$ref' in schema) {
    return schema.$ref;
  }
  return '';
}

export function getPropertyByPathKey(schema: SchemaObject, key: string) {
  const splittedKey = key.split(/[:=]/);

  if (splittedKey.length === 3) {
    if (splittedKey[1] === '$ref') {
      const subProperty = schema.properties[splittedKey[0]];
      const regex = new RegExp(splittedKey[2]);
      const ref = getRefWhenExists(subProperty);

      if (!ref || regex.test(ref) === false) {
        throw new Error(
          `getPropertyByPathKey: cannot found $ref values from "${JSON.stringify(
            schema
          )}", $ref "${ref}" and key "${key}"`
        );
      }

      return subProperty as SchemaObject;
    }

    throw new Error(`getPropertyByPathKey: incorrect key: ${key}`);
  }

  let propertyKey = key;
  let isArraySchema = false;

  if (key.endsWith('[]')) {
    propertyKey = key.replace('[]', '');
    isArraySchema = true;
  }

  if (propertyKey in schema.properties) {
    const result = schema.properties[propertyKey] as SchemaObject;

    if (isArraySchema && result.type === 'array') {
      return result;
    }

    if (!isArraySchema && result.type !== 'array') {
      return result;
    }
  }

  throw new Error(`getPropertyByPathKey: cannot found property: ${key}`);
}

export function findPropertyInfoByPaths(
  schema: SchemaObject,
  paths: string[],
  seekerIndex = 0
): IntermediatePropertyCheckResultDto {
  const currKey = paths[seekerIndex];
  const lastIndex = paths.length - 1;

  try {
    const property = getPropertyByPathKey(schema, currKey);

    if (property) {
      if (lastIndex > seekerIndex) {
        return findPropertyInfoByPaths(property, paths, seekerIndex + 1);
      }

      return {
        suitable: true,
        endSchema: property,
        pathIndex: seekerIndex,
        $ref: getRefWhenExists(property),
      };
    }
  } catch (error) {
    //
  }

  return {
    suitable: false,
    endSchema: schema,
    pathIndex: seekerIndex,
    $ref: '',
  };
}
