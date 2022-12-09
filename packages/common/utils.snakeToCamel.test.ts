import { snakeToCamel } from './utils';

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
