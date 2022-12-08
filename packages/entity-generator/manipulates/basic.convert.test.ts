import {
  extractEntityModuleNameModel,
  extractBaseEntityNameFromPath,
} from './basic.convert';

describe('extractEntityModuleNameModel', () => {
  it('스키마 제목으로 모듈 명칭 데이터를 만든다.', () => {
    const result = extractEntityModuleNameModel('jordy_goods_info');

    expect(result).toEqual({
      version: '',
      fullName: 'jordyGoodsInfo',
      featureName: 'jordy',
      fullNameAsPascalCase: 'JordyGoodsInfo',
      featureNameAsPascalCase: 'Jordy',
    });
  });

  it('제목에 버전 정보가 있으면 그것을 따로 구분해준다.', () => {
    const result = extractEntityModuleNameModel('v1_jordy_goods_info');

    expect(result).toEqual({
      version: 'v1',
      fullName: 'jordyGoodsInfo',
      featureName: 'jordy',
      fullNameAsPascalCase: 'JordyGoodsInfo',
      featureNameAsPascalCase: 'Jordy',
    });
  });
});

describe('extractBaseEntityNameFromPath', () => {
  it.each([
    [
      'api 경로로 엔티티 명칭을 만든다.',
      'lookpin/shopping/numberOne',
      'LookpinShoppingNumberOne',
    ],
    [
      '경로가 snake_case 로 이뤄져 있어도 올바르게 PascalCase 로 만들어준다.',
      'lookpin/good_shopping/number_one',
      'LookpinGoodShoppingNumberOne',
    ],
    [
      '경로가 kebab-case 로 이뤄져 있어도 올바르게 PascalCase 로 만들어준다.',
      'lookpin/good-shopping/number-one',
      'LookpinGoodShoppingNumberOne',
    ],
    [
      '경로 앞에 슬래시(/)가 있으면 이를 제거하고 만든다.',
      '/lookpin/shopping/numberOne',
      'LookpinShoppingNumberOne',
    ],
    [
      '경로 뒤에 슬래시(/)가 있으면 이를 제거하고 만든다.',
      '/lookpin/shopping/numberOne/',
      'LookpinShoppingNumberOne',
    ],
    [
      '경로 끝에 path parameter 가 있으면 이를 제거하고 만든다.',
      '/lookpin/shopping/numberOne/{corp_id}',
      'LookpinShoppingNumberOne',
    ],
    [
      '경로 중간에 path parameter 가 있으면 이를 제거하고 만든다.',
      '/lookpin/shopping/numberOne/{corp-id}/bulk',
      'LookpinShoppingNumberOneBulk',
    ],
    [
      '경로 두곳에 path parameter 가 있으면 이를 제거하고 만든다.',
      '/lookpin/shopping/numberOne/{corp-id}/bulk/{my_id}/do-it',
      'LookpinShoppingNumberOneBulkDoIt',
    ],
  ])('%s', (_, given, then) => {
    const result = extractBaseEntityNameFromPath(given);

    expect(result).toBe(then);
  });

  it.each([
    [
      '삭제 키워드가 주어지면 경로에서 그 내용을 지우고 만든다.',
      '/lookpin/shopping/numberOne/{corp-id}/bulk/{myId}/do-it',
      'bulk',
      'LookpinShoppingNumberOneDoIt',
    ],
    [
      '삭제 키워드가 경로의 일부여도 정상적으로 동작된다.',
      '/api/re19/lookpin/shopping/numberOne/{corp-id}/bulk/{my_id}/do-it',
      '/api/re19',
      'LookpinShoppingNumberOneBulkDoIt',
    ],
  ])('%s', (_, given0, given1, then) => {
    const result = extractBaseEntityNameFromPath(given0, given1);

    expect(result).toBe(then);
  });
});
