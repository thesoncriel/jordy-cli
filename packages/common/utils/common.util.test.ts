import {
  getFileNameExcludeExt,
  hasPathParameter,
  snakeToCamel,
  toCapitalize,
} from './common.util';

describe('hasPathParameter', () => {
  it('주어진 경로에 패스 파라미터가 있다면 true 다.', () => {
    const result = hasPathParameter('/api/member/blahData/{id}');

    expect(result).toBe(true);
  });

  it('경로 중간에 패스 파라미터가 있다면 true 다.', () => {
    const result = hasPathParameter('/api/member/{memberId}/modify');

    expect(result).toBe(true);
  });

  it('경로에 패스 파라미터가 없다면 false 다.', () => {
    const result = hasPathParameter('/api/member/blahData/search');

    expect(result).toBe(false);
  });
});

describe('snakeToCamel', () => {
  it('언더바로 구분된 문자열을 캐멀 케이스로 만든다.', () => {
    const result = snakeToCamel('lookpin_is_only_number_one');

    expect(result).toBe('lookpinIsOnlyNumberOne');
  });

  it('대시로 구분된 문자열을 캐멀 케이스로 만든다.', () => {
    const result = snakeToCamel('lookpin-is-only-number-one');

    expect(result).toBe('lookpinIsOnlyNumberOne');
  });

  it('슬래시로 구분된 문자열을 캐멀 케이스로 만든다.', () => {
    const result = snakeToCamel('lookpin/is/only/number/one');

    expect(result).toBe('lookpinIsOnlyNumberOne');
  });

  it('구분된 문자열 일부가 캐멀 케이서여도 전체를 올바르게 캐멀 케이스로 만든다.', () => {
    const result = snakeToCamel('oh_myLookpinLove_user_thumbUp');

    expect(result).toBe('ohMyLookpinLoveUserThumbUp');
  });

  it('빈 문자열은 빈 값으로 내보낸다.', () => {
    const result = snakeToCamel('');

    expect(result).toBe('');
  });

  it('이미 캐멀 케이스라면 그대로 내보낸다.', () => {
    const result = snakeToCamel('lookpinIsOnlyNumberOne');

    expect(result).toBe('lookpinIsOnlyNumberOne');
  });
});

describe('toCapitalize', () => {
  it('영문 글자의 첫 글자를 대문자로 바꿔준다.', () => {
    const result = toCapitalize('lookpin');

    expect(result).toBe('Lookpin');
  });

  it('camel case 일 경우 pascal case 로 바꿔준다.', () => {
    const result = toCapitalize('sonicAndTails');

    expect(result).toBe('SonicAndTails');
  });

  it('한 글자일 경우 대문자 한 글자로 바꿔준다.', () => {
    const result = toCapitalize('y');

    expect(result).toBe('Y');
  });

  it('좌우 공백을 없앴을 때 내용이 비었다면 빈 값을 내보낸다.', () => {
    const result = toCapitalize('    ');

    expect(result).toBe('');
  });

  it('비어있거나 문자열이 아니라면 빈 값을 내보낸다.', () => {
    const result1 = toCapitalize('');
    const result2 = toCapitalize(null);
    const result3 = toCapitalize(1 as never);
    const result4 = toCapitalize(undefined);
    const result5 = toCapitalize(NaN as never);
    const result6 = toCapitalize({} as never);

    expect(result1).toBe('');
    expect(result2).toBe('');
    expect(result3).toBe('');
    expect(result4).toBe('');
    expect(result5).toBe('');
    expect(result6).toBe('');
  });
});

describe('getFileNameExcludeExt', () => {
  it('특정 경로에서 확장자를 제외한 파일명을 가져온다.', () => {
    const result = getFileNameExcludeExt(
      '/home/myCom/works/prj/vom vom/some/sources/target.yaml'
    );

    expect(result).toBe('target');
  });

  it('파일에 확장자가 없다면 그 이름값만 가져온다.', () => {
    const result = getFileNameExcludeExt(
      '/home/myCom/works/prj/vom vom/some/sources/target'
    );

    expect(result).toBe('target');
  });

  it('상대경로여도 의도대로 동작된다.', () => {
    const result = getFileNameExcludeExt(
      '../prj/vom vom/some/sources/lookpinSite.html'
    );

    expect(result).toBe('lookpinSite');
  });

  it('경로에 파일이 포함 안되어 있다면 빈 값을 내보낸다.', () => {
    const result = getFileNameExcludeExt('../prj/vom vom/some/sources/');

    expect(result).toBe('');
  });
});
