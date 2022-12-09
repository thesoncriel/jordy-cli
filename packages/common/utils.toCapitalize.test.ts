import { toCapitalize } from './utils';

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
