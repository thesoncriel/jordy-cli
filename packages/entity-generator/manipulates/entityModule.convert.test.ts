import {
  EntitySchemaModel,
  EntitySchemaTypeEnum,
  EntitySuffixTypeEnum,
  IntermediatePropertyModel,
} from '../types';
import { createIntermediatePathModel } from './basic.create';
import { toEntitySchemaModel } from './entityModule.convert';

function createTestIntermediateProperty() {
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

describe('toEntitySchemaModel', () => {
  const pathInfo = createIntermediatePathModel();

  pathInfo.path = '/myApi/version7/jordy/goods/happyOrder';
  pathInfo.baseName = 'JordyGoodsHappyOrder';
  pathInfo.description = '블라블라 죠르디';

  function createTestProperties() {
    const prop0 = createTestIntermediateProperty();

    prop0.name = 'order_name';
    prop0.type = 'string';
    prop0.description = '주문이름';

    const prop1 = createTestIntermediateProperty();

    prop1.name = 'user_mbti';
    prop1.type = 'string';
    prop1.description = '사용자 MBTI';

    const prop2 = createTestIntermediateProperty();

    prop2.name = 'any_count';
    prop2.type = 'integer';
    prop2.description = '아무개수';

    return [prop0, prop1, prop2];
  }

  const preDeclared = new Map<string, EntitySchemaModel>();
  const mockSetter = vi.spyOn(preDeclared, 'set');
  const mockGetter = vi.spyOn(preDeclared, 'get');

  function toEntitySchemaModelBySimple(
    imData: IntermediatePropertyModel,
    suffix: EntitySuffixTypeEnum
  ) {
    const result = toEntitySchemaModel(
      imData,
      pathInfo,
      pathInfo.baseName,
      suffix,
      preDeclared
    );

    return result;
  }

  afterEach(() => {
    mockSetter.mockClear();
    mockGetter.mockClear();
  });

  describe('1 depth single', () => {
    it('속성이 비어있다면 그 결과도 비어있다.', () => {
      const imData = createTestIntermediateProperty();

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [],
        description: '블라블라 죠르디',
      });
    });

    it('속성 개수만큼 하위 속성이 만들어진다.', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();

      properties[1].nullable = true;

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '주문이름',
          },
          {
            name: 'user_mbti',
            type: 'string',
            nullable: true,
            required: true,
            description: '사용자 MBTI',
          },
          {
            name: 'any_count',
            type: 'number',
            nullable: false,
            required: true,
            description: '아무개수',
          },
        ],
        description: '블라블라 죠르디',
      });
    });

    it('타입이 enum 이면 enum 형식으로 만들어진다.', () => {
      const imData = createTestIntermediateProperty();

      imData.type = 'string';
      imData.enum = ['order_name', 'user_mbti', 'any_count'];

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENUM
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEnum',
        type: EntitySchemaTypeEnum.ENUM,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          },
          {
            name: 'user_mbti',
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          },
          {
            name: 'any_count',
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          },
        ],
        description: '블라블라 죠르디',
      });
    });

    it('타입이 enum 이나 하위 요소가 2개 이하라면 union type 으로 만들어진다.', () => {
      const imData = createTestIntermediateProperty();

      imData.type = 'string';
      imData.enum = ['order_name', 'user_mbti'];

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENUM
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchType',
        type: EntitySchemaTypeEnum.UNION,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          },
          {
            name: 'user_mbti',
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          },
        ],
        description: '블라블라 죠르디',
      });
    });
  }); // 1 depth single [end]

  describe('1 depth array', () => {
    it('타입이 배열이면 그에 맞게 변환된다.', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();

      properties[1] = {
        ...properties[1],
        name: 'num_data',
        type: 'array',
        itemsType: 'integer',
        description: '숫자 목록',
      };

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '주문이름',
          },
          {
            name: 'num_data',
            type: 'number[]',
            nullable: false,
            required: true,
            description: '숫자 목록',
          },
          {
            name: 'any_count',
            type: 'number',
            nullable: false,
            required: true,
            description: '아무개수',
          },
        ],
        description: '블라블라 죠르디',
      });
    });

    it('여러 필드가 배열이어도 정상적으로 적용된다.', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();

      properties[1] = {
        ...properties[1],
        name: 'num_data',
        type: 'array',
        itemsType: 'integer',
        description: '숫자 목록',
      };

      properties[2] = {
        ...properties[2],
        name: 'names',
        type: 'array',
        itemsType: 'string',
        description: '이름 목록',
      };

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '주문이름',
          },
          {
            name: 'num_data',
            type: 'number[]',
            nullable: false,
            required: true,
            description: '숫자 목록',
          },
          {
            name: 'names',
            type: 'string[]',
            nullable: false,
            required: true,
            description: '이름 목록',
          },
        ],
        description: '블라블라 죠르디',
      });
    });
  }); // 1 depth array [end]

  describe('2 depth single', () => {
    describe('프로퍼티 타입이 객체일 때', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();

      properties[0].name = 'test_jordy_data';
      properties[0].type = 'object';
      properties[0].description = '죠르디 데이터';
      properties[0].itemsProperties = createTestProperties();

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      const savedType = preDeclared.get(
        'JordyGoodsHappyOrderTestJordyDataEntity'
      );

      it('타입 적용', () => {
        expect(result).toEqual({
          name: 'JordyGoodsHappyOrderSearchEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'test_jordy_data',
              type: 'JordyGoodsHappyOrderTestJordyDataEntity',
              nullable: false,
              required: true,
              description: '죠르디 데이터',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'any_count',
              type: 'number',
              nullable: false,
              required: true,
              description: '아무개수',
            },
          ],
          description: '블라블라 죠르디',
        });
      });

      it('타입 보관', () => {
        expect(savedType).toEqual({
          name: 'JordyGoodsHappyOrderTestJordyDataEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'order_name',
              type: 'string',
              nullable: false,
              required: true,
              description: '주문이름',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'any_count',
              type: 'number',
              nullable: false,
              required: true,
              description: '아무개수',
            },
          ],
          description: '',
        });
      });
    });

    describe('프로퍼티 타입이 enum 일 때', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();
      const enumValues = ['awaken', 'working', 'running', 'sleeping', 'angry'];

      properties[2] = {
        ...properties[2],
        name: 'jordy_status',
        type: 'string',
        enum: enumValues,
        description: '죠르디 상태',
      };

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      const savedType = preDeclared.get('JordyGoodsHappyOrderJordyStatusEnum');

      afterAll(() => {
        preDeclared.clear();
      });

      it('타입 적용', () => {
        expect(result).toEqual({
          name: 'JordyGoodsHappyOrderSearchEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'order_name',
              type: 'string',
              nullable: false,
              required: true,
              description: '주문이름',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'jordy_status',
              type: 'JordyGoodsHappyOrderJordyStatusEnum',
              nullable: false,
              required: true,
              description: '죠르디 상태',
            },
          ],
          description: '블라블라 죠르디',
        });
      });

      it('타입 보관', () => {
        expect(savedType).toEqual({
          name: 'JordyGoodsHappyOrderJordyStatusEnum',
          type: EntitySchemaTypeEnum.ENUM,
          properties: enumValues.map((name) => ({
            name,
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          })),
          description: '',
        });
      });
    });
  }); // 2 depth single [end]

  describe('2 depth multi', () => {
    const imData = createTestIntermediateProperty();
    const properties = createTestProperties();
    const enumValues = ['awaken', 'working', 'running', 'sleeping', 'angry'];

    properties[0] = {
      ...properties[0],
      name: 'jordy_status',
      type: 'string',
      enum: enumValues,
      description: '죠르디 상태',
    };

    properties[2] = {
      ...properties[2],
      name: 'goods_info',
      type: 'object',
      description: '굿즈 정보',
      itemsProperties: createTestProperties(),
    };

    imData.itemsProperties = properties;

    const result = toEntitySchemaModelBySimple(
      imData,
      EntitySuffixTypeEnum.ENTITY
    );

    const savedType0 = preDeclared.get('JordyGoodsHappyOrderJordyStatusEnum');
    const savedType1 = preDeclared.get('JordyGoodsHappyOrderGoodsInfoEntity');

    afterAll(() => {
      preDeclared.clear();
    });

    it('타입 적용', () => {
      expect(result).toEqual({
        name: 'JordyGoodsHappyOrderSearchEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [
          {
            name: 'jordy_status',
            type: 'JordyGoodsHappyOrderJordyStatusEnum',
            nullable: false,
            required: true,
            description: '죠르디 상태',
          },
          {
            name: 'user_mbti',
            type: 'string',
            nullable: false,
            required: true,
            description: '사용자 MBTI',
          },
          {
            name: 'goods_info',
            type: 'JordyGoodsHappyOrderGoodsInfoEntity',
            nullable: false,
            required: true,
            description: '굿즈 정보',
          },
        ],
        description: '블라블라 죠르디',
      });
    });

    it('타입 보관', () => {
      expect(savedType0).toEqual({
        name: 'JordyGoodsHappyOrderJordyStatusEnum',
        type: EntitySchemaTypeEnum.ENUM,
        properties: enumValues.map((name) => ({
          name,
          type: 'string',
          nullable: false,
          required: true,
          description: '',
        })),
        description: '',
      });

      expect(savedType1).toEqual({
        name: 'JordyGoodsHappyOrderGoodsInfoEntity',
        type: EntitySchemaTypeEnum.INTERFACE,
        properties: [
          {
            name: 'order_name',
            type: 'string',
            nullable: false,
            required: true,
            description: '주문이름',
          },
          {
            name: 'user_mbti',
            type: 'string',
            nullable: false,
            required: true,
            description: '사용자 MBTI',
          },
          {
            name: 'any_count',
            type: 'number',
            nullable: false,
            required: true,
            description: '아무개수',
          },
        ],
        description: '',
      });
    });
  });

  describe('2 depth array', () => {
    describe('객체형 배열일 때', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();

      properties[2] = {
        ...properties[2],
        name: 'goods_list',
        type: 'array',
        required: false,
        itemsType: 'object',
        description: '죠르디 굿즈 목록',
        itemsProperties: createTestProperties(),
      };

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      const savedType = preDeclared.get('JordyGoodsHappyOrderGoodsListEntity');

      afterAll(() => {
        preDeclared.clear();
      });

      it('타입 적용', () => {
        expect(result).toEqual({
          name: 'JordyGoodsHappyOrderSearchEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'order_name',
              type: 'string',
              nullable: false,
              required: true,
              description: '주문이름',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'goods_list',
              type: 'JordyGoodsHappyOrderGoodsListEntity[]',
              nullable: false,
              required: false,
              description: '죠르디 굿즈 목록',
            },
          ],
          description: '블라블라 죠르디',
        });
      });

      it('타입 보관', () => {
        expect(savedType).toEqual({
          name: 'JordyGoodsHappyOrderGoodsListEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'order_name',
              type: 'string',
              nullable: false,
              required: true,
              description: '주문이름',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'any_count',
              type: 'number',
              nullable: false,
              required: true,
              description: '아무개수',
            },
          ],
          description: '',
        });
      });
    });

    describe('열거형 배열일 때', () => {
      const imData = createTestIntermediateProperty();
      const properties = createTestProperties();
      const enumValues = ['awaken', 'working', 'running', 'sleeping', 'angry'];

      properties[2] = {
        ...properties[2],
        name: 'jordy_status_items',
        type: 'array',
        itemsType: 'string',
        enum: enumValues,
        description: '죠르디 상태들',
        itemsProperties: createTestProperties(),
      };

      imData.itemsProperties = properties;

      const result = toEntitySchemaModelBySimple(
        imData,
        EntitySuffixTypeEnum.ENTITY
      );

      const savedType = preDeclared.get(
        'JordyGoodsHappyOrderJordyStatusItemsEnum'
      );

      afterAll(() => {
        preDeclared.clear();
      });

      it('타입 적용', () => {
        expect(result).toEqual({
          name: 'JordyGoodsHappyOrderSearchEntity',
          type: EntitySchemaTypeEnum.INTERFACE,
          properties: [
            {
              name: 'order_name',
              type: 'string',
              nullable: false,
              required: true,
              description: '주문이름',
            },
            {
              name: 'user_mbti',
              type: 'string',
              nullable: false,
              required: true,
              description: '사용자 MBTI',
            },
            {
              name: 'jordy_status_items',
              type: 'JordyGoodsHappyOrderJordyStatusItemsEnum[]',
              nullable: false,
              required: true,
              description: '죠르디 상태들',
            },
          ],
          description: '블라블라 죠르디',
        });
      });

      it('타입 보관', () => {
        expect(savedType).toEqual({
          name: 'JordyGoodsHappyOrderJordyStatusItemsEnum',
          type: EntitySchemaTypeEnum.ENUM,
          properties: enumValues.map((name) => ({
            name,
            type: 'string',
            nullable: false,
            required: true,
            description: '',
          })),
          description: '',
        });
      });
    });
  }); // 2 depth array [end]
});
