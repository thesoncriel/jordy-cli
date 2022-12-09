import { isEqual } from 'lodash-es';
import {
  EntitySchemaModel,
  EntitySchemaTypeEnum,
  EntitySuffixTypeEnum,
  IntermediatePropertyModel,
  RepositoryBehaviorTypeEnum,
} from '../types';
import { toEntitySchemaModel } from './toEntitySchemaModel';
import {
  createTestIntermediateProperty,
  createTestPathInfo,
  createTestProperties,
  extractParts,
} from './_fixtures';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomMatchers<Arg = any, R = unknown> {
  toLikeProp(receive: Arg): R;
  toLikePropExcludeType(receive: Arg): R;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}

expect.extend({
  toLikeProp(received, expected) {
    const { isNot } = this;

    return {
      message: () => `expected${isNot ? ' not' : ''} like right received.`,
      pass: isEqual(extractParts(received), extractParts(expected)),
    };
  },
  toLikePropExcludeType(received, expected) {
    const { isNot } = this;

    return {
      message: () => `expected${isNot ? ' not' : ''} like right received.`,
      pass: isEqual(
        extractParts(received, ['type']),
        extractParts(expected, ['type'])
      ),
    };
  },
});

describe('toEntitySchemaModel', () => {
  let imData = createTestIntermediateProperty();
  let pathInfo = createTestPathInfo();
  let baseName = pathInfo.baseName;

  const preDeclared = new Map<string, EntitySchemaModel>();
  const mockSetter = vi.spyOn(preDeclared, 'set');
  const mockGetter = vi.spyOn(preDeclared, 'get');

  function doTestFn(
    imData: IntermediatePropertyModel,
    suffix: EntitySuffixTypeEnum = EntitySuffixTypeEnum.ENTITY
  ) {
    const result = toEntitySchemaModel(
      imData,
      pathInfo,
      baseName,
      suffix,
      preDeclared
    );

    return result;
  }

  afterEach(() => {
    mockSetter.mockClear();
    mockGetter.mockClear();
    preDeclared.clear();

    imData = createTestIntermediateProperty();
    pathInfo = createTestPathInfo();
    baseName = pathInfo.baseName;
  });

  describe('엔티티 메타데이터 생성', () => {
    it('주어진 name 과 suffix 를 이용하여 타입 명칭을 만든다.', () => {
      const result = doTestFn(imData);

      expect(result.name).toBe('JordyGoodsHappyOrderSearchEntity');
      expect(result.type).toBe(EntitySchemaTypeEnum.INTERFACE);
    });

    it('base name 과 behavior 가 변경되면 만들어진 명칭에 이 것이 반영된다.', () => {
      baseName = 'LookpinJordyOutdoorProduct';
      pathInfo.behavior = RepositoryBehaviorTypeEnum.UPDATE;
      pathInfo.baseName = baseName;

      const result = doTestFn(imData);

      expect(result.name).toBe('LookpinJordyOutdoorProductUpdateEntity');
      expect(result.type).toBe(EntitySchemaTypeEnum.INTERFACE);
    });

    it('enum 관련 설정을 주면 타입명이 열거형으로 바뀐다.', () => {
      imData.type = 'string';
      imData.enum = ['a', 'b', 'c'];

      const result = doTestFn(imData, EntitySuffixTypeEnum.ENUM);

      expect(result.name).toBe('JordyGoodsHappyOrderSearchEnum');
      expect(result.type).toBe(EntitySchemaTypeEnum.ENUM);
    });

    it('enum 설정이어도 상수 설정이 2개 이하면 union type 명칭이 된다.', () => {
      imData.type = 'string';
      imData.enum = ['a', 'b'];

      const result = doTestFn(imData, EntitySuffixTypeEnum.ENUM);

      expect(result.name).toBe('JordyGoodsHappyOrderSearchType');
      expect(result.type).toBe(EntitySchemaTypeEnum.UNION);
    });
  }); // 엔티티 메타데이터 생성 [end]

  describe('하위 엔티티 메타 데이터 생성', () => {
    beforeEach(() => {
      preDeclared.clear();
      baseName = 'OhMy';
    });

    it('만들어진 타입이 하위 2 depth 기반일 경우, 출신 프로퍼티명이 엔티티명에 포함된다.', () => {
      imData.itemsProperties = createTestProperties();
      imData.itemsProperties[1].name = 'lookpin_will';
      imData.itemsProperties[1].type = 'object';

      doTestFn(imData, EntitySuffixTypeEnum.ENTITY);

      const subType = preDeclared.get('OhMyLookpinWillEntity');

      expect(subType).not.toBeUndefined();
      expect(preDeclared.size).toBe(1);
    });
    it('하위 3 depth 기반이라면 각 출신 프로퍼티명이 엔티티명에 포함된다.', () => {
      imData.itemsProperties = createTestProperties();
      imData.itemsProperties[1].name = 'lookpin_will';
      imData.itemsProperties[1].type = 'object';
      imData.itemsProperties[1].itemsProperties = createTestProperties();

      imData.itemsProperties[1].itemsProperties[2].name = 'be_nice_shop';
      imData.itemsProperties[1].itemsProperties[2].type = 'object';

      doTestFn(imData, EntitySuffixTypeEnum.ENTITY);

      const subType = preDeclared.get('OhMyLookpinWillBeNiceShopEntity');

      expect(subType).not.toBeUndefined();
      expect(preDeclared.size).toBe(2);
    });
    it('하위 4 depth 기반이라면 각 출신 프로퍼티명이 엔티티명에 포함된다.', () => {
      imData.itemsProperties = createTestProperties();
      imData.itemsProperties[1].name = 'lookpin_will';
      imData.itemsProperties[1].type = 'object';
      imData.itemsProperties[1].itemsProperties = createTestProperties();

      imData.itemsProperties[1].itemsProperties[2].name = 'be_nice_shop';
      imData.itemsProperties[1].itemsProperties[2].type = 'object';
      imData.itemsProperties[1].itemsProperties[2].itemsProperties =
        createTestProperties();

      imData.itemsProperties[1].itemsProperties[2].itemsProperties[0].name =
        'of_world';
      imData.itemsProperties[1].itemsProperties[2].itemsProperties[0].type =
        'object';

      doTestFn(imData, EntitySuffixTypeEnum.ENTITY);

      const subType = preDeclared.get('OhMyLookpinWillBeNiceShopOfWorldEntity');

      expect(subType).not.toBeUndefined();
      expect(preDeclared.size).toBe(3);
    });

    it('하위 2 depth 는 array, 4 depth 까지 object 기반이라면 각 출신 프로퍼티명이 엔티티명에 포함된다.', () => {
      imData.itemsProperties = createTestProperties();
      imData.itemsProperties[1].name = 'lookpin_will';
      imData.itemsProperties[1].type = 'array';
      imData.itemsProperties[1].itemsType = 'object';
      imData.itemsProperties[1].itemsProperties = createTestProperties();

      imData.itemsProperties[1].itemsProperties[2].name = 'be_nice_shop';
      imData.itemsProperties[1].itemsProperties[2].type = 'object';
      imData.itemsProperties[1].itemsProperties[2].itemsProperties =
        createTestProperties();

      imData.itemsProperties[1].itemsProperties[2].itemsProperties[0].name =
        'of_world';
      imData.itemsProperties[1].itemsProperties[2].itemsProperties[0].type =
        'object';

      doTestFn(imData, EntitySuffixTypeEnum.ENTITY);

      const subType = preDeclared.get('OhMyLookpinWillBeNiceShopOfWorldEntity');

      expect(subType).not.toBeUndefined();
      expect(preDeclared.size).toBe(3);
    });
  }); // 하위 엔티티 메타 데이터 생성 [end]

  describe('1 depth single', () => {
    it('속성이 비어있다면 그 결과도 비어있다.', () => {
      const result = doTestFn(imData);

      expect(result.properties).toEqual([]);
    });

    it('속성 개수만큼 하위 속성이 만들어진다.', () => {
      const properties = createTestProperties();

      properties[1].nullable = true;
      imData.itemsProperties = properties;

      const result = doTestFn(imData);

      expect(result.properties).toLikeProp(properties);
    });

    it('타입이 enum 이면 enum 형식으로 만들어진다.', () => {
      imData.type = 'string';
      imData.enum = ['order_name', 'user_mbti', 'any_count'];

      const result = doTestFn(imData, EntitySuffixTypeEnum.ENUM);

      expect(result.properties.map((prop) => prop.name)).toEqual(imData.enum);
    });

    it('타입이 enum 이나 하위 요소가 2개 이하라면 union type 으로 만들어진다.', () => {
      imData.type = 'string';
      imData.enum = ['order_name', 'user_mbti'];

      const result = doTestFn(imData, EntitySuffixTypeEnum.ENUM);

      expect(result.properties.map((prop) => prop.name)).toEqual(imData.enum);
    });
  }); // 1 depth single [end]

  describe('1 depth array', () => {
    it('타입이 배열이면 그에 맞게 변환된다.', () => {
      const properties = createTestProperties();

      properties[1] = {
        ...properties[1],
        name: 'num_data',
        type: 'array',
        itemsType: 'integer',
        description: '숫자 목록',
      };
      imData.itemsProperties = properties;

      const result = doTestFn(imData);

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[1].type).toBe('integer[]');
    });

    it('여러 필드가 배열이어도 정상적으로 적용된다.', () => {
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

      const result = doTestFn(imData);

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[1].type).toBe('integer[]');
      expect(result.properties[2].type).toBe('string[]');
    });
  }); // 1 depth array [end]

  describe('2 depth single', () => {
    it('프로퍼티 타입이 객체일 때', () => {
      const properties = createTestProperties();

      properties[0].name = 'test_jordy_data';
      properties[0].type = 'object';
      properties[0].description = '죠르디 데이터';
      properties[0].itemsProperties = createTestProperties();

      imData.itemsProperties = properties;

      const result = doTestFn(imData);
      const savedType = preDeclared.get(
        'JordyGoodsHappyOrderTestJordyDataEntity'
      );

      expect(result.properties).toLikePropExcludeType(properties);
      expect(savedType.properties).toLikePropExcludeType(
        properties[0].itemsProperties
      );
    });

    it('프로퍼티 타입이 enum 일 때', () => {
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

      const result = doTestFn(imData);
      const savedType = preDeclared.get('JordyGoodsHappyOrderJordyStatusEnum');

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[2].type).toBe(
        'JordyGoodsHappyOrderJordyStatusEnum'
      );
      expect(savedType.properties.map((prop) => prop.name)).toEqual(enumValues);
    });

    it('프로퍼티에 하위 타입이 2개일 때', () => {
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

      const result = doTestFn(imData);
      const savedType0 = preDeclared.get('JordyGoodsHappyOrderJordyStatusEnum');
      const savedType1 = preDeclared.get('JordyGoodsHappyOrderGoodsInfoEntity');

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[0].type).toBe(
        'JordyGoodsHappyOrderJordyStatusEnum'
      );
      expect(result.properties[2].type).toBe(
        'JordyGoodsHappyOrderGoodsInfoEntity'
      );
      expect(savedType0.properties.map((prop) => prop.name)).toEqual(
        enumValues
      );
      expect(savedType1.properties).toLikeProp(properties[2].itemsProperties);
    });
  }); // 2 depth single [end]

  describe('2 depth array', () => {
    it('객체형 배열일 때', () => {
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

      const result = doTestFn(imData);
      const savedType = preDeclared.get('JordyGoodsHappyOrderGoodsListEntity');

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[2].type).toBe(
        'JordyGoodsHappyOrderGoodsListEntity[]'
      );
      expect(savedType.properties).toLikePropExcludeType(
        properties[2].itemsProperties
      );
    });

    it('열거형 배열일 때', () => {
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

      const result = doTestFn(imData);
      const savedType = preDeclared.get(
        'JordyGoodsHappyOrderJordyStatusItemsEnum'
      );

      expect(result.properties).toLikePropExcludeType(properties);
      expect(result.properties[2].type).toBe(
        'JordyGoodsHappyOrderJordyStatusItemsEnum[]'
      );
      expect(savedType.properties.map((prop) => prop.name)).toEqual(enumValues);
    });
  }); // 2 depth array [end]
});
