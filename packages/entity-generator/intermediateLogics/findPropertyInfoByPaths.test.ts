import {
  getPropertyByPathKey,
  findPropertyInfoByPaths,
} from './findPropertyInfoByPaths';
import sampleJson from '../_fixtures/openapi_content_001.json';
import { SchemaObject } from 'openapi3-ts';

describe('getPropertyByPathKey', () => {
  const given =
    sampleJson.paths['/some/version3/jordy/testSample/{id}'].get.responses[200]
      .content['application/json'].schema;

  it('주어진 키에 맞는 프로퍼티 스키마를 가져온다.', () => {
    const result = getPropertyByPathKey(given as SchemaObject, 'information');

    expect(result).toEqual(given.properties.information);
  });

  it('스키마를 가져올 수 없다면 오류를 일으킨다.', () => {
    expect(() =>
      getPropertyByPathKey(given as SchemaObject, 'someThumb')
    ).toThrowError('cannot found');
  });

  it('주어진 키에 $ref 와 정규표현식이 포함되면 스키마의 $ref 값이 정규표현식에 맞는지 검사한다.', () => {
    const result = getPropertyByPathKey(
      given.properties.information as SchemaObject,
      'somePattern:$ref=yaml$'
    );

    expect(result).toEqual(given.properties.information.properties.somePattern);
  });

  it('$ref 와 지정된 정규표현식에 맞지 않다면 오류를 일으킨다.', () => {
    expect(() =>
      getPropertyByPathKey(
        given.properties.information as SchemaObject,
        'somePattern:$ref=jordy_noop'
      )
    ).toThrowError('cannot found');
  });
});

describe('findPropertyInfoByPaths', () => {
  const given =
    sampleJson.paths['/some/version3/jordy/testSample/{id}'].get.responses[200]
      .content['application/json'].schema;

  describe('주어진 openapi 스키마에 특정 경로 정보가 포함되는지 확인한다.', () => {
    it('포함된 경로라면 true 이다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'result',
        'data',
        'normal',
      ]);

      expect(result.suitable).toBe(true);
    });

    it('경로가 포함 된다면, 결과 중 property 는 해당 경로의 끝지점(endpoint) 스키마를 전달한다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'result',
        'data',
        'normal',
      ]);

      expect(result.endSchema).toEqual(
        given.properties.result.properties.data.properties.normal
      );
    });

    it('경로 끝에 "[]"가 있다면 그 끝지점 데이터는 배열(Array) 형태여야 한다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'result',
        'data',
        'items[]',
      ]);

      expect(result.endSchema).toEqual(
        given.properties.result.properties.data.properties.items
      );
    });

    it('경로 끝에 "[]"가 있으나 끝지점 데이터가 배열이 아니면 그 결과는 false 이다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'result',
        'data',
        'normal[]',
      ]);

      expect(result.suitable).toBe(false);
    });

    it('경로 끝에 "[]"가 없으나 끝지점 데이터가 배열이라면 그 결과는 false 이다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'result',
        'data',
        'items',
      ]);

      expect(result.suitable).toBe(false);
    });

    it('경로가 포함되지 않으면 false 이다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'some',
        'jordy',
      ]);

      expect(result.suitable).toBe(false);
    });

    it('경로 끝에 $ref 정보가 있다면 그 값이 결과 데이터에 포함된다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'information',
        'code',
      ]);

      expect(result.suitable).toBe(true);
      expect(result.$ref).toBe('#/components/schemas/jordy_information_code');
    });
  });

  describe('$ref 와 정규표현식', () => {
    describe('유효할 때', () => {
      it('찾는 경로 끝에 정규표현식이 있다면 이를 이용하여 적합성 여부를 확인할 수 있다.', () => {
        const result = findPropertyInfoByPaths(given as SchemaObject, [
          'information',
          'code:$ref=code$',
        ]);

        expect(result.suitable).toBe(true);
        expect(result.$ref).toBe('#/components/schemas/jordy_information_code');
      });

      it('정규표현식은 $ref 가 상대경로 파일을 가르킬 때도 동작된다.', () => {
        const result = findPropertyInfoByPaths(given as SchemaObject, [
          'information',
          'somePattern:$ref=code.yaml$',
        ]);

        expect(result.suitable).toBe(true);
        expect(result.$ref).toBe(
          '../../ref_components/schemas/jordy_hi_code.yaml'
        );
      });
    });

    it('property 는 있으나 $ref 값이 정규표현식에 맞지 않다면 결과는 false 이다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'information',
        'somePattern:$ref=lookpin$',
      ]);

      expect(result.suitable).toBe(false);
    });

    it('찾은 property 가 정규표현식에 맞지 않다면, 마지막으로 유효했던 경로의 프로퍼티를 내보낸다.', () => {
      const result = findPropertyInfoByPaths(given as SchemaObject, [
        'information',
        'somePattern:$ref=lookpin$',
      ]);

      expect(result.endSchema).toEqual(given.properties.information);
    });
  });
});
