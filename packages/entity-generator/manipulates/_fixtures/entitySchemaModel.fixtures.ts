import { IntermediatePropertyModel } from '../../types';
import { createIntermediatePathModel } from '../basic.create';

export interface SemiEntityModel {
  name: string;
  type: string;
  nullable: boolean;
  required: boolean;
  description: string;
}

export function extractParts<T extends SemiEntityModel>(
  properties: T[],
  excludeFields?: (keyof T)[]
) {
  return properties.map((prop) => {
    const result = {
      name: prop.name,
      type: prop.type,
      nullable: prop.nullable,
      required: prop.required,
      description: prop.description,
    };

    if (excludeFields) {
      return excludeFields.reduce((next, key) => {
        delete next[key as never];

        return next;
      }, result);
    }

    return result;
  });
}

export function createTestIntermediateProperty() {
  const result: IntermediatePropertyModel = {
    name: 'lookpin',
    type: 'object',
    nullable: false,
    required: true,
    description: '죠르디 입니다.',
    $ref: '',
    oneOfProperties: [],
    itemsProperties: [],
  };

  return result;
}

export function createTestPathInfo() {
  const pathInfo = createIntermediatePathModel();

  pathInfo.path = '/myApi/version7/jordy/goods/happyOrder';
  pathInfo.baseName = 'JordyGoodsHappyOrder';
  pathInfo.description = '블라블라 죠르디';

  return pathInfo;
}

export function createTestProperties(subject: 'normal' | 'pet' = 'normal') {
  const result: IntermediatePropertyModel[] = Array(subject === 'pet' ? 5 : 3)
    .fill(0)
    .reduce((collect) => {
      collect.push(createTestIntermediateProperty());

      return collect;
    }, [] as IntermediatePropertyModel[]);

  if (subject === 'normal') {
    result[0].name = 'order_name';
    result[0].type = 'string';
    result[0].description = '주문이름';

    result[1].name = 'user_mbti';
    result[1].type = 'string';
    result[1].description = '사용자 MBTI';

    result[2].name = 'any_count';
    result[2].type = 'integer';
    result[2].description = '아무개수';
  }

  if (subject === 'pet') {
    result[0].name = 'is_young';
    result[0].type = 'boolean';
    result[0].description = '30대 미만 여부';

    result[1].name = 'pet_name';
    result[1].type = 'string';
    result[1].description = '애완동물 이름';

    result[2].name = 'pet_age';
    result[2].type = 'number';
    result[2].description = '애완동물 나이';

    result[3].name = 'pet_type';
    result[3].type = 'string';
    result[3].enum = ['cat', 'dog', 'bird', 'lizard', 'insect'];
    result[3].description = '애완동물 종류';

    result[4].name = 'what_the_field';
    result[4].type = 'string';
    result[4].description = '뭘하지 -_-';
  }

  return result;
}
