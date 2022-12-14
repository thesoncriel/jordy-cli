import {
  extractIntermediateBodyRequest,
  extractIntermediatePropertyModel,
} from './extractProperty';
import sampleJson from '../_fixtures/openapi_content_001.json';
import { RequestBodyObject, SchemaObject } from 'openapi3-ts';
import { IntermediatePropertyModel } from '../types';

describe('extractIntermediatePropertyModel', () => {
  const baseGiven =
    sampleJson.paths['/some/version3/jordy/testSample/{id}'].get.responses[200]
      .content['application/json'].schema;

  it('openapi 스키마 자료를 중간 자료로 변환한다.', () => {
    const result = extractIntermediatePropertyModel(
      'lookpin',
      baseGiven.properties.result.properties.data.properties
        .normal as SchemaObject
    );

    expect(result).toEqual({
      name: 'lookpin',
      type: 'string',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
      $ref: '',
      oneOfProperties: [],
      itemsProperties: [],
    } as IntermediatePropertyModel);
  });

  it('스키마가 열거형일 때 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'lookpin',
      baseGiven.properties.result.properties.data.properties
        .enum_value as SchemaObject
    );

    expect(result).toEqual({
      name: 'lookpin',
      type: 'string',
      nullable: false,
      required: true,
      description: '소닉 친구들',
      $ref: '',
      enum: ['sonic', 'tails', 'knuckles', 'dr.eggman', 'shadow'],
      oneOfProperties: [],
      itemsProperties: [],
    } as IntermediatePropertyModel);
  });

  it('스키마가 열거형 배열일 때 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'lookpin',
      baseGiven.properties.result.properties.data.properties
        .enum_array as SchemaObject
    );

    expect(result).toEqual({
      name: 'lookpin',
      type: 'array',
      nullable: false,
      required: true,
      description: '여러개 선택',
      $ref: '',
      enum: ['바지', '셔츠', '맨투맨'],
      oneOfProperties: [],
      itemsProperties: [],
    } as IntermediatePropertyModel);
  });

  it('스키마 타입이 필드당 여럿이어도 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'oneOf_value',
      baseGiven.properties.result.properties.data.properties
        .oneOf_value as SchemaObject
    );

    expect(result).toEqual({
      name: 'oneOf_value',
      type: 'object',
      nullable: false,
      required: true,
      description: '둘중 하나입니다.',
      $ref: '',
      oneOfProperties: [
        {
          name: 'oneOf_value_one',
          type: 'object',
          nullable: false,
          required: true,
          description: 'one',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [
            {
              name: 'value',
              type: 'string',
              nullable: false,
              required: true,
              description: '',
              $ref: '',
              enum: ['하나', '한놈', '일'],
              oneOfProperties: [],
              itemsProperties: [],
            },
          ],
        },
        {
          name: 'oneOf_value_two',
          type: 'object',
          nullable: false,
          required: true,
          description: 'two',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [
            {
              name: 'value',
              type: 'string',
              nullable: false,
              required: true,
              description: '',
              $ref: '',
              enum: ['둘', '두놈', '이'],
              oneOfProperties: [],
              itemsProperties: [],
            },
          ],
        },
      ],
      itemsProperties: [],
    } as IntermediatePropertyModel);
  });

  it('스키마가 단일 타입 배열 형식이어도 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'lookpin',
      baseGiven.properties.result.properties.data.properties
        .arr_values as SchemaObject
    );

    expect(result).toEqual({
      name: 'lookpin',
      type: 'array',
      nullable: false,
      required: true,
      description: '문자열 배열 입니다.',
      $ref: '',
      itemsType: 'string',
      oneOfProperties: [],
      itemsProperties: [],
    } as IntermediatePropertyModel);
  });

  it('스키마가 객체 타입 배열 형식이어도 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'lookpin',
      baseGiven.properties.result.properties.data.properties
        .items as SchemaObject
    );

    expect(result).toEqual({
      name: 'lookpin',
      type: 'array',
      nullable: false,
      required: true,
      description: '객체 배열 데이터 입니다.',
      $ref: '',
      oneOfProperties: [],
      itemsProperties: [
        {
          name: 'name',
          type: 'string',
          nullable: false,
          required: true,
          description: '이름',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
        {
          name: 'age',
          type: 'integer',
          nullable: false,
          required: true,
          description: '나이',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
        {
          name: 'from',
          type: 'string',
          nullable: true,
          required: true,
          description: '출신',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
        {
          name: 'job_status',
          type: 'unknown',
          nullable: false,
          required: true,
          description: '',
          $ref: '#/components/schemas/jordy_job_status',
          oneOfProperties: [],
          itemsProperties: [],
        },
      ],
    } as IntermediatePropertyModel);
  });

  it('스키마가 다층 객체 형식이어도 의도대로 변환된다.', () => {
    const result = extractIntermediatePropertyModel(
      'jordy_data',
      baseGiven.properties.result.properties.data.properties
        .obj_value as SchemaObject
    );

    expect(result).toEqual({
      name: 'jordy_data',
      type: 'object',
      nullable: false,
      required: true,
      description: '객체 입니다.',
      $ref: '',
      oneOfProperties: [],
      itemsProperties: [
        {
          name: 'name',
          type: 'string',
          nullable: false,
          required: true,
          description: '이름',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
        {
          name: 'size',
          type: 'integer',
          nullable: false,
          required: true,
          description: '싸이즈',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
        {
          name: 'blah',
          type: 'string',
          nullable: true,
          required: true,
          description: '블라블라',
          $ref: '',
          oneOfProperties: [],
          itemsProperties: [],
        },
      ],
    } as IntermediatePropertyModel);
  });
});

describe('extractIntermediateBodyRequest', () => {
  const baseGiven =
    sampleJson.paths['/some/version3/jordy/testSample/{id}'].put;

  it('request body 가 있다면 그 내용을 property list 로 바꿔준다.', () => {
    const result = extractIntermediateBodyRequest(
      baseGiven.requestBody as RequestBodyObject
    );

    expect(result).toEqual([
      {
        name: 'goods_list',
        type: 'array',
        nullable: false,
        required: true,
        description: '죠르디 굿즈 목록',
        $ref: '',
        oneOfProperties: [],
        itemsProperties: [
          {
            name: 'id',
            type: 'integer',
            nullable: false,
            required: true,
            description: '굿즈 번호',
            $ref: '',
            oneOfProperties: [],
            itemsProperties: [],
          },
          {
            name: 'name',
            type: 'string',
            nullable: false,
            required: true,
            description: '굿즈 명칭',
            $ref: '',
            oneOfProperties: [],
            itemsProperties: [],
          },
          {
            name: 'alias',
            type: 'string',
            nullable: false,
            required: false,
            description: '굿즈 별칭',
            $ref: '',
            oneOfProperties: [],
            itemsProperties: [],
          },
        ],
      },
      {
        name: 'need_hearts',
        type: 'boolean',
        nullable: false,
        required: false,
        description: '하트 필요여부',
        $ref: '',
        oneOfProperties: [],
        itemsProperties: [],
      },
    ] as IntermediatePropertyModel[]);
  });
});
