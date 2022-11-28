import { FeatureFileInfoDto } from './types';
import { TypeScriptFilePathParser } from './TypeScriptFilePathParser';

describe('TypeScriptFilePathParser', () => {
  const normalPath =
    '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries/sonicBoomSeries.effect.ts';
  const relativePath =
    './src/features/summer/stores/rainCloud/summerRainCloud.effect.ts';

  describe('findFeatureNameFrom', () => {
    function findFeatureNameFrom(value: string): string {
      return new TypeScriptFilePathParser().findFeatureNameFrom(
        value.split('/')
      );
    }

    it('분할된 경로에서 feature name 을 추출한다.', () => {
      const result = findFeatureNameFrom(normalPath);

      expect(result).toBe('sonic');
    });

    it('상대 경로를 주어도 정상적으로 내용 추출 가능하다.', () => {
      const result = findFeatureNameFrom(relativePath);

      expect(result).toBe('summer');
    });

    it('공용 모듈(common, core, shared) 경로일 경우 그 내용을 추출 할 수 있다.', () => {
      const result1 = findFeatureNameFrom('./src/common/components/basic');
      const result2 = findFeatureNameFrom('./src/shared/stores/products');
      const result3 = findFeatureNameFrom(
        '/home/lookpin/working/prj/src/core/entities/member'
      );

      expect(result1).toBe('common');
      expect(result2).toBe('shared');
      expect(result3).toBe('core');
    });

    it('기능 모듈 폴더를 찾을 수 없으면 에러를 일으킨다.', () => {
      expect(() =>
        findFeatureNameFrom('/home/blah/src/feat/components/Lookpin.tsx')
      ).toThrowError();
    });

    it('기능 모듈 폴더를 찾았으나 그 이후 경로에 아무것도 없으면 에러를 일으킨다.', () => {
      expect(() =>
        findFeatureNameFrom('/home/blah/src/features')
      ).toThrowError();
      expect(() =>
        findFeatureNameFrom('/home/blah/src/features/')
      ).toThrowError();
      expect(() => findFeatureNameFrom('./src/features/')).toThrowError();
    });
  });

  describe('findSubNamesBySubLayer', () => {
    function findSubNamesBySubLayer(subLayer: string, splittedPath: string[]) {
      return new TypeScriptFilePathParser().findSubNamesBySubLayer(
        subLayer,
        splittedPath
      );
    }

    it.each([
      [
        '분할된 경로에서 하위명칭을 추출한다.',
        'components',
        '/home/works/jordy-prj/src/features/jordy/components/haha/hoho/kaka/koko/WhatView.tsx',
        ['haha', 'hoho', 'kaka', 'koko'],
      ],
      [
        '분할된 경로가 상대경로여도 의도대로 추출한다.',
        'components',
        './src/features/jordy/components/haha/hoho/kaka/koko/WhatView.tsx',
        ['haha', 'hoho', 'kaka', 'koko'],
      ],
      [
        '경로가 서브계층 루트라면 빈 값을 내보낸다.',
        'components',
        './src/features/jordy/components',
        [],
      ],
      [
        '하위 경로가 하나밖에 없다면 그 값만 내보낸다.',
        'components',
        './src/features/jordy/components/lookpinApp',
        ['lookpinApp'],
      ],
      [
        '하위 경로가 하나뿐이고 끝에 슬래시가 있어도 의도대로 동작된다.',
        'components',
        './src/features/jordy/components/lookpinApp/',
        ['lookpinApp'],
      ],
      [
        '경로가 서브계층 루트인데 끝에 슬래시가 있어도 빈 값을 내보낸다.',
        'components',
        './src/features/jordy/components/',
        [],
      ],
      [
        '경로가 서브계층 루트일 때 하위 파일이 있어도 빈 값을 내보낸다.',
        'components',
        './src/features/jordy/components/WhatView.tsx',
        [],
      ],
      [
        '분할된 경로가 서브계층에 속하지 않는다면 빈 값을 내보낸다.',
        'containers',
        './src/features/jordy/components/haha/hoho/kaka/koko/WhatView.tsx',
        [],
      ],
      [
        '분할된 경로가 분석 불가능한 경로라면 빈 값을 내보낸다.',
        'containers',
        '/home/myFolder/features/jordy',
        [],
      ],
      [
        '디자인 시스템 경로여도 정상적으로 동작된다.',
        'components',
        './src/ui/components/materials/tags/BaseTag.tsx',
        ['materials', 'tags'],
      ],
      [
        '디자인 시스템 하위 모듈이 1개여도 정상적으로 동작된다.',
        'components',
        './src/ui/components/materials',
        ['materials'],
      ],
      [
        '디자인 시스템 루트 경로는 빈 값을 내보낸다.',
        'components',
        './src/ui/components',
        [],
      ],
    ])('%s', (_, subLayer, path, expects) => {
      const { subNames } = findSubNamesBySubLayer(subLayer, path.split('/'));

      expect(subNames).toEqual(expects);
    });
  });

  describe('findSubNamesFrom', () => {
    function findSubNamesFrom(value: string) {
      return new TypeScriptFilePathParser().findSubNamesFrom(value.split('/'));
    }

    it.each([
      [
        '분할된 경로에서 sub name 을 추출한다.', //
        normalPath,
        ['boomSeries'],
      ],
      [
        '상대 경로를 주어도 정상적으로 추출 가능하다.',
        relativePath,
        ['rainCloud'],
      ],
    ])('%s', (_, path, expects) => {
      const result = findSubNamesFrom(path);

      expect(result).toEqual(expects);
    });

    it('sub name 을 추출할 수 없으면 에러를 일으킨다.', () => {
      expect(() =>
        findSubNamesFrom('/root/work/src/features/stores/nya.wtf.ts')
      ).toThrowError();
    });
  });

  describe('parse', () => {
    const parser = new TypeScriptFilePathParser();

    describe('인자: 1개', () => {
      it.each([
        [
          '주어진 경로값을 분석하여 객체로 만든다.',
          '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries/sonicBoomSeries.effect.ts',
          {
            fullName: 'sonicBoomSeries',
            fullNameAsPascalCase: 'SonicBoomSeries',
            storybookTitle: 'sonic/boomSeries',
            featureName: 'sonic',
            featureNameAsPascalCase: 'Sonic',
            subNames: ['boomSeries'],
            subPath: 'boomSeries',
            firstSubName: 'boomSeries',
            fileName: 'sonicBoomSeries.effect',
            fileExt: 'ts',
            fileNameAsPascalCase: 'SonicBoomSeriesEffect',
          },
        ],
        [
          '경로에 파일이 없을 경우, 파일명과 확장자는 빈값이다.',
          '/home/theson/lookpin-prj/src/features/sonic/stores/boomSeries',
          {
            fullName: 'sonicBoomSeries',
            fullNameAsPascalCase: 'SonicBoomSeries',
            storybookTitle: 'sonic/boomSeries',
            featureName: 'sonic',
            featureNameAsPascalCase: 'Sonic',
            subNames: ['boomSeries'],
            subPath: 'boomSeries',
            firstSubName: 'boomSeries',
            fileName: '',
            fileExt: '',
            fileNameAsPascalCase: '',
          },
        ],
        [
          '컴포넌트 경로에 sub name 이 포함 안되어있다면 sub name 은 빈값 취급된다.',
          '/home/theson/lookpin-prj/src/features/sonic/components/GreenHillView.tsx',
          {
            fullName: 'sonic',
            fullNameAsPascalCase: 'Sonic',
            storybookTitle: 'sonic',
            featureName: 'sonic',
            featureNameAsPascalCase: 'Sonic',
            subNames: [],
            subPath: '',
            firstSubName: '',
            fileName: 'GreenHillView',
            fileExt: 'tsx',
            fileNameAsPascalCase: 'GreenHillView',
          },
        ],
      ])('%s', (_, path, expects) => {
        const result = parser.parse(path);

        expect(result).toEqual(expects);
      });
    });

    describe('인자: 2개', () => {
      it.each([
        [
          '두가지 인자값을 넣으면 첫번째를 main feature, 두번째를 sub feature 로 인식한다.',
          'lookpin',
          'search',
          {
            fullName: 'lookpinSearch',
            fullNameAsPascalCase: 'LookpinSearch',
            storybookTitle: 'lookpin/search',
            featureName: 'lookpin',
            featureNameAsPascalCase: 'Lookpin',
            subNames: ['search'],
            subPath: 'search',
            firstSubName: 'search',
            fileName: '',
            fileExt: '',
            fileNameAsPascalCase: '',
          },
        ],
        [
          '두가지 인자값을 넣었는데 두번째가 비었다면, sub feature 는 빈값으로 인식된다.',
          'lookpin',
          '',
          {
            fullName: 'lookpin',
            fullNameAsPascalCase: 'Lookpin',
            storybookTitle: 'lookpin',
            featureName: 'lookpin',
            featureNameAsPascalCase: 'Lookpin',
            subNames: [],
            subPath: '',
            firstSubName: '',
            fileName: '',
            fileExt: '',
            fileNameAsPascalCase: '',
          },
        ],
        [
          '두번째 인자가 문자열이 아니라면 sub feature 는 빈 값으로 인식된다.',
          'lookpin',
          undefined,
          {
            fullName: 'lookpin',
            fullNameAsPascalCase: 'Lookpin',
            storybookTitle: 'lookpin',
            featureName: 'lookpin',
            featureNameAsPascalCase: 'Lookpin',
            subNames: [],
            subPath: '',
            firstSubName: '',
            fileName: '',
            fileExt: '',
            fileNameAsPascalCase: '',
          },
        ],
      ])('%s', (_, given1, given2, expects) => {
        const result = parser.parse(given1, given2);

        expect(result).toEqual(expects);
      });
    });

    it('경로에 sub name 이 포함 안되어있다면 오류를 일으킨다.', () => {
      expect(() =>
        parser.parse('/home/theson/lookpin-prj/src/features/sonic/stores')
      ).toThrowError();
    });
  });

  describe('parseForComponent', () => {
    const parser = new TypeScriptFilePathParser();

    describe.each([
      [
        '모듈과 하위 모듈, 컴포넌트 명칭으로 분석된 결과를 만들수 있다.',
        [
          [
            '하위 모듈 포함',
            'lookpin/search',
            'SearchTable',
            {
              fullName: 'lookpinSearch',
              fullNameAsPascalCase: 'LookpinSearch',
              storybookTitle: 'lookpin/search',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: ['search'],
              subPath: 'search',
              firstSubName: 'search',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
          [
            '하위 모듈 없음',
            'lookpin',
            'SearchTable',
            {
              fullName: 'lookpin',
              fullNameAsPascalCase: 'Lookpin',
              storybookTitle: 'lookpin',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
        ],
      ],
      [
        '실제 폴더 경로와 컴포넌트 명칭으로 의도대로 분석된다.',
        [
          [
            '하위 경로 포함',
            '/home/theson/work/myProject/src/features/lookpin/components/search',
            'SearchTable',
            {
              fullName: 'lookpinSearch',
              fullNameAsPascalCase: 'LookpinSearch',
              storybookTitle: 'lookpin/search',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: ['search'],
              subPath: 'search',
              firstSubName: 'search',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
          [
            '하위 경로 없음',
            '/home/theson/work/myProject/src/features/lookpin/components',
            'SearchTable',
            {
              fullName: 'lookpin',
              fullNameAsPascalCase: 'Lookpin',
              storybookTitle: 'lookpin',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
        ],
        [
          '상대 경로를 주어도 의도대로 분석된다.',
          [
            '하위경로 포함',
            './src/features/lookpin/components/search',
            'SearchTable',
            {
              fullName: 'lookpinSearch',
              fullNameAsPascalCase: 'LookpinSearch',
              storybookTitle: 'lookpin/search',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: ['search'],
              subPath: 'search',
              firstSubName: 'search',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
          [
            '하위경로 없음',
            './src/features/lookpin/components',
            'SearchTable',
            {
              fullName: 'lookpin',
              fullNameAsPascalCase: 'Lookpin',
              storybookTitle: 'lookpin',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'SearchTable',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'SearchTable',
            },
          ],
        ],
      ],
      [
        '기능 모듈 경로',
        [
          [
            '절대경로',
            '/home/mall/my/project/src/features/lookpin',
            'OtherViewPanel',
            {
              fullName: 'lookpin',
              fullNameAsPascalCase: 'Lookpin',
              storybookTitle: 'lookpin',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'OtherViewPanel',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'OtherViewPanel',
            },
          ],
          [
            '상대경로',
            './src/features/lookpin',
            'OtherViewPanel',
            {
              fullName: 'lookpin',
              fullNameAsPascalCase: 'Lookpin',
              storybookTitle: 'lookpin',
              featureName: 'lookpin',
              featureNameAsPascalCase: 'Lookpin',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'OtherViewPanel',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'OtherViewPanel',
            },
          ],
        ],
      ],
      [
        'UI 모듈 경로',
        [
          [
            '절대경로 & 컴포넌트 루트',
            '/c/works/gits/some-project/src/ui/components',
            'DesignSystemView',
            {
              fullName: 'ui',
              fullNameAsPascalCase: 'Ui',
              storybookTitle: 'ui',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
          [
            '절대경로 & 서브 경로',
            '/c/works/gits/some-project/src/ui/components/views',
            'DesignSystemView',
            {
              fullName: 'uiViews',
              fullNameAsPascalCase: 'UiViews',
              storybookTitle: 'ui/views',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: ['views'],
              subPath: 'views',
              firstSubName: 'views',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
          [
            '절대경로 & 서브 경로 여러개',
            '/c/works/gits/some-project/src/ui/components/search/forms/section',
            'DesignSystemView',
            {
              fullName: 'uiSearchFormsSection',
              fullNameAsPascalCase: 'UiSearchFormsSection',
              storybookTitle: 'ui/search/forms/section',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: ['search', 'forms', 'section'],
              subPath: 'search/forms/section',
              firstSubName: 'search',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
          [
            '상대경로 & 컴포넌트 루트',
            './src/ui/components',
            'DesignSystemView',
            {
              fullName: 'ui',
              fullNameAsPascalCase: 'Ui',
              storybookTitle: 'ui',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: [],
              subPath: '',
              firstSubName: '',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
          [
            '상대경로 & 서브 경로',
            './src/ui/components/views',
            'DesignSystemView',
            {
              fullName: 'uiViews',
              fullNameAsPascalCase: 'UiViews',
              storybookTitle: 'ui/views',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: ['views'],
              subPath: 'views',
              firstSubName: 'views',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
          [
            '상대경로 & 서브 경로 여러개',
            './src/ui/components/search/forms/section',
            'DesignSystemView',
            {
              fullName: 'uiSearchFormsSection',
              fullNameAsPascalCase: 'UiSearchFormsSection',
              storybookTitle: 'ui/search/forms/section',
              featureName: 'ui',
              featureNameAsPascalCase: 'Ui',
              subNames: ['search', 'forms', 'section'],
              subPath: 'search/forms/section',
              firstSubName: 'search',
              fileName: 'DesignSystemView',
              fileExt: 'tsx',
              fileNameAsPascalCase: 'DesignSystemView',
            },
          ],
        ],
      ],
    ])('%s', (_, cases) => {
      it.each(cases)(
        '%s',
        (_, given1: string, given2: string, expects: FeatureFileInfoDto) => {
          const result = parser.parseForComponent(given1, given2);

          expect(result).toEqual(expects);
        }
      );
    });
  });
});
