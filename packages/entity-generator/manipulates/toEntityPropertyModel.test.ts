import { IntermediatePropertyModel } from '../types';
import { toEntityPropertyModel } from './toEntityPropertyModel';
import { createTestIntermediateProperty } from './_fixtures';

describe('toEntityPropertyModel', () => {
  const mockFn = vi.fn(
    (
      _targetType: 'object' | 'enum',
      _parentProp: IntermediatePropertyModel
    ) => {
      return 'LookpinValueEntity';
    }
  );

  afterEach(() => {
    mockFn.mockClear();
  });

  it('기본형은 곧바로 만들어진다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'string';

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'string',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });
  });

  it('열거형이면 타입 콜백을 호출한다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'string';
    given.enum = ['one', 'two', 'three', 'four'];

    mockFn.mockImplementationOnce(() => 'TestLookpinEnum');

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'TestLookpinEnum',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });

    expect(mockFn).toBeCalled();
  });

  it('객체형이면 타입 콜백을 호출한다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'object';

    mockFn.mockImplementationOnce(() => 'TestLookpinShopEntity');

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'TestLookpinShopEntity',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });

    expect(mockFn).toBeCalled();
  });

  it('기본형 배열이면 그에 맞게 타입이 바꿔진다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'array';
    given.itemsType = 'string';

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'string[]',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });
  });

  it('객체형 배열이면 타입 콜백을 호출한다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'array';
    given.itemsType = 'object';

    mockFn.mockImplementationOnce(() => 'TestLookpinEntity');

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'TestLookpinEntity[]',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });

    expect(mockFn).toBeCalled();
  });

  it('열거형 배열이면 타입 콜백을 호출한다.', () => {
    const given = createTestIntermediateProperty();

    given.type = 'array';
    given.itemsType = 'string';
    given.enum = ['one', 'two', 'three', 'four'];

    mockFn.mockImplementationOnce(() => 'TestLookpinEnum');

    const result = toEntityPropertyModel(given, mockFn);

    expect(result).toEqual({
      name: 'lookpin',
      type: 'TestLookpinEnum[]',
      nullable: false,
      required: true,
      description: '죠르디 입니다.',
    });

    expect(mockFn).toBeCalled();
  });
});
