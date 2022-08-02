import { TypeScriptFilePathParser } from './TypeScriptFilePathParser';

describe('TypeScriptFilePathParser', () => {
  const normalPath =
    '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries/sonicBoomSeries.effect.ts';
  const relativePath =
    './src/features/summer/stores/rainCloud/summerRainCloud.effect.ts';

  describe('extractFeatureName', () => {
    function extractFeatureName(value: string): string {
      return new TypeScriptFilePathParser().extractFeatureName(
        value.split('/')
      );
    }

    it('분할된 경로에서 feature name 을 추출한다.', () => {
      const result = extractFeatureName(normalPath);

      expect(result).toBe('sonic');
    });

    it('상대 경로를 주어도 정상적으로 내용 추출 가능하다.', () => {
      const result = extractFeatureName(relativePath);

      expect(result).toBe('summer');
    });

    it('기능 모듈 폴더를 찾을 수 없으면 에러를 일으킨다.', () => {
      expect(() =>
        extractFeatureName('/home/blah/src/feat/components/Lookpin.tsx')
      ).toThrowError();
    });

    it('기능 모듈 폴더를 찾았으나 그 이후 경로에 아무것도 없으면 에러를 일으킨다.', () => {
      expect(() =>
        extractFeatureName('/home/blah/src/features')
      ).toThrowError();
      expect(() =>
        extractFeatureName('/home/blah/src/features/')
      ).toThrowError();
      expect(() => extractFeatureName('./src/features/')).toThrowError();
    });
  });

  describe('extractSubName', () => {
    function extractSubName(value: string): string {
      return new TypeScriptFilePathParser().extractSubName(value.split('/'));
    }

    it('분할된 경로에서 sub name 을 추출한다.', () => {
      const result = extractSubName(normalPath);

      expect(result).toBe('boomSeries');
    });

    it('상대 경로를 주어도 정상적으로 추출 가능하다.', () => {
      const result = extractSubName(relativePath);

      expect(result).toBe('rainCloud');
    });

    it('sub name 을 추출할 수 없으면 에러를 일으킨다.', () => {
      expect(() =>
        extractSubName('/root/work/src/features/stores/nya.wtf.ts')
      ).toThrowError();
    });
  });

  describe('parse', () => {
    const parser = new TypeScriptFilePathParser();

    it('주어진 경로값을 분석하여 객체로 만든다.', () => {
      const result = parser.parse(
        '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries/sonicBoomSeries.effect.ts'
      );

      expect(result).toEqual({
        fullName: 'sonicBoomSeries',
        fullNameAsPascalCase: 'SonicBoomSeries',
        featureName: 'sonic',
        featureNameAsPascalCase: 'Sonic',
        subName: 'boomSeries',
        fileName: 'sonicBoomSeries.effect',
        fileExt: 'ts',
        fileNameAsPascalCase: 'SonicBoomSeriesEffect',
      });
    });

    it('경로에 파일이 없을 경우, 파일명과 확장자는 빈값이다.', () => {
      const result = parser.parse(
        '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries'
      );

      expect(result).toEqual({
        fullName: 'sonicBoomSeries',
        fullNameAsPascalCase: 'SonicBoomSeries',
        featureName: 'sonic',
        featureNameAsPascalCase: 'Sonic',
        subName: 'boomSeries',
        fileName: '',
        fileExt: '',
        fileNameAsPascalCase: '',
      });
    });

    it('경로에 sub name 이 포함 안되어있다면 오류를 일으킨다.', () => {
      expect(() =>
        parser.parse('/home/theson/lookpin-prj/src/features/sonic/stores')
      ).toThrowError();
    });

    it('두가지 인자값을 넣으면 첫번째를 main feature, 두번째를 sub feature 로 인식한다.', () => {
      const result = parser.parse('lookpin', 'search');

      expect(result).toEqual({
        fullName: 'lookpinSearch',
        fullNameAsPascalCase: 'LookpinSearch',
        featureName: 'lookpin',
        featureNameAsPascalCase: 'Lookpin',
        subName: 'search',
        fileName: '',
        fileExt: '',
        fileNameAsPascalCase: '',
      });
    });

    it('두가지 인자값을 넣었는데 두번째가 비었다면, sub feature 를 basic 으로 자동 인식한다.', () => {
      const result = parser.parse('lookpin', '');

      expect(result).toEqual({
        fullName: 'lookpinBasic',
        fullNameAsPascalCase: 'LookpinBasic',
        featureName: 'lookpin',
        featureNameAsPascalCase: 'Lookpin',
        subName: 'basic',
        fileName: '',
        fileExt: '',
        fileNameAsPascalCase: '',
      });
    });

    it('두번째 인자가 문자열이 아니라면 sub feature 를 basic 으로 자동 인식한다.', () => {
      const result = parser.parse('lookpin', undefined);

      expect(result).toEqual({
        fullName: 'lookpinBasic',
        fullNameAsPascalCase: 'LookpinBasic',
        featureName: 'lookpin',
        featureNameAsPascalCase: 'Lookpin',
        subName: 'basic',
        fileName: '',
        fileExt: '',
        fileNameAsPascalCase: '',
      });
    });
  });
});
