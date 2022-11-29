import { createFeatureNameInfo } from './FeatureNameInfo';

describe('FeatureNameInfo', () => {
  describe('feature 와 sub 명칭을 함께 설정', () => {
    const config = createFeatureNameInfo('myPhone', ['blockThing']);

    it('feature name 은 camelCase 이다.', () => {
      expect(config.featureName).toBe('myPhone');
    });

    it('feature name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.featureNameAsPascalCase).toBe('MyPhone');
    });

    it('sub name 은 camelCase 이다.', () => {
      expect(config.subNames).toEqual(['blockThing']);
    });

    it('full name 은 feature name 과 sub name 이 합쳐진 것이며 camelCase 이다.', () => {
      expect(config.fullName).toBe('myPhoneBlockThing');
    });

    it('full name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.fullNameAsPascalCase).toBe('MyPhoneBlockThing');
    });

    it('storybook title 은 feature 와 sub 사이에 슬래시(/)가 포함된다.', () => {
      expect(config.storybookTitle).toBe('myPhone/blockThing');
    });
  });

  describe('feature 와 sub 명칭 여러개를 함께 설정', () => {
    const config = createFeatureNameInfo('myPhone', [
      'blockThing',
      'anyThing',
      'someThing',
    ]);

    it('feature name 은 camelCase 이다.', () => {
      expect(config.featureName).toBe('myPhone');
    });

    it('feature name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.featureNameAsPascalCase).toBe('MyPhone');
    });

    it('sub name 은 camelCase 이다.', () => {
      expect(config.subNames).toEqual(['blockThing', 'anyThing', 'someThing']);
    });

    it('full name 은 feature name 과 sub name 이 합쳐진 것이며 camelCase 이다.', () => {
      expect(config.fullName).toBe('myPhoneBlockThingAnyThingSomeThing');
    });

    it('full name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.fullNameAsPascalCase).toBe(
        'MyPhoneBlockThingAnyThingSomeThing'
      );
    });

    it('storybook title 은 feature 와 sub 사이에 슬래시(/)가 포함된다.', () => {
      expect(config.storybookTitle).toBe(
        'myPhone/blockThing/anyThing/someThing'
      );
    });
  });

  describe('feature 명칭만 설정', () => {
    const config = createFeatureNameInfo('myPhone');

    it('feature name 은 camelCase 이다.', () => {
      expect(config.featureName).toBe('myPhone');
    });

    it('feature name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.featureNameAsPascalCase).toBe('MyPhone');
    });

    it('sub name 은 빈 배열이다.', () => {
      expect(config.subNames).toEqual([]);
    });

    it('full name 은 feature name 의 camelCase 이다.', () => {
      expect(config.fullName).toBe('myPhone');
    });

    it('full name 을 PascalCase 로 가져올 수 있다.', () => {
      expect(config.fullNameAsPascalCase).toBe('MyPhone');
    });

    it('storybook title 은 feature 만 포함된다.', () => {
      expect(config.storybookTitle).toBe('myPhone');
    });
  });
});
