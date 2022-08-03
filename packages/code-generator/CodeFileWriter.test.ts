import Handlebars from 'handlebars';
import { CodeFileWriterService } from './CodeFileWriter';
import {
  TemplateCompiler,
  TextFileAppendFn,
  TextFileReaderFn,
  TextFileWriterFn,
} from './types';
import { codeFileWriterFixtures } from './_fixtures/CodeFileWriter.fixtures';

const {
  getConfig,
  getConfigForOverwriteTest,
  getConfigForAppendTest,
  getConfigForNoTemplateTest,
  getFileInfo,
  getConfigForFolderTest,
} = codeFileWriterFixtures;

function createMockFn() {
  const compile = vi.fn((async (templateText, data) => {
    const template = Handlebars.compile(templateText);

    const source = template(data);

    return source;
  }) as TemplateCompiler);

  const read = vi.fn((async () => {
    const result = '{{featureName}}.{{subName}}';

    return result;
  }) as TextFileReaderFn);

  const write = vi.fn((async (path, data, forceOverwrite) => {
    if (path.includes('already/exists') && data && !forceOverwrite) {
      return Promise.reject(new Error('already exists'));
    }
    return true;
  }) as TextFileWriterFn);

  const appendLogic = vi.fn();

  const append = vi.fn((async (_targetPath, _sourceCode, _data, logic) => {
    if (logic === 'unknown') {
      throw new Error('fail');
    }
    appendLogic();
    return true;
  }) as TextFileAppendFn);

  const mkdir = vi.fn();

  return {
    compile,
    read,
    write,
    appendLogic,
    append,
    mkdir,
  };
}

describe('CodeFileWriterService', () => {
  describe('지정된 템플릿 경로로 템플릿을 가져오고 데이터를 삽입할 수 있다.', async () => {
    const { read, compile, write, append, appendLogic, mkdir } = createMockFn();
    const service = new CodeFileWriterService(
      read,
      compile,
      write,
      append,
      mkdir
    );
    const config = getConfig();
    const fileInfo = getFileInfo();
    const result = await service.makeAll(config, fileInfo);

    const sampleSourceCode = `${fileInfo.featureName}.${fileInfo.subName}`;
    const samplePath0 = `src/feat/${fileInfo.featureName}/${fileInfo.subName}/${fileInfo.fileName}Awesome.tsx`;
    const samplePath1 = `src/feat/${fileInfo.featureName}/${fileInfo.subName}/${fileInfo.fileName}.tsx`;

    afterAll(() => {
      compile.mockClear();
      read.mockClear();
      write.mockClear();
      append.mockClear();
      appendLogic.mockClear();
      mkdir.mockClear();
    });

    it('만들어진 결과 개수는 설정 정보 개수와 일치한다.', () => {
      expect(result).toBe(config.files.length);
    });

    it('설정된 템플릿 정보만큼 파일을 호출한다.', () => {
      expect(read).toBeCalledTimes(config.files.length);
      expect(read).toBeCalledWith(config.files[0].template);
      expect(read).toBeCalledWith(config.files[1].template);
    });

    it('설정된 템플릿 정보만큼 컴파일한다.', () => {
      expect(compile).toBeCalledTimes(config.files.length * 2);
      expect(compile).toHaveReturnedWith(sampleSourceCode);
      expect(compile).toHaveReturnedWith(samplePath0);
    });

    it('설정된 정보만큼 소스코드 파일을 만든다.', () => {
      expect(write).toBeCalledTimes(config.files.length);
      expect(write).toBeCalledWith(samplePath0, sampleSourceCode, false);
      expect(write).toBeCalledWith(samplePath1, sampleSourceCode, true);
    });
  });

  describe('만들려는 소스파일이 이미 존재할 때', async () => {
    const { read, compile, write, append, appendLogic, mkdir } = createMockFn();
    const service = new CodeFileWriterService(
      read,
      compile,
      write,
      append,
      mkdir
    );
    const fileInfo = getFileInfo();

    afterEach(() => {
      compile.mockClear();
      read.mockClear();
      write.mockClear();
      append.mockClear();
      appendLogic.mockClear();
      mkdir.mockClear();
    });

    it('append logic 이 설정되어있지 않다면 덮어 씌운다.', async () => {
      const config = getConfigForOverwriteTest();
      const result = await service.makeAll(config, fileInfo);

      expect(result).toBe(1);
      expect(write).toBeCalledWith(
        `${config.base}/some/already/exists/${fileInfo.fileName}.ts`,
        `${fileInfo.featureName}.${fileInfo.subName}`,
        true
      );
      expect(append).not.toBeCalled();
    });
    it('append logic 이 있다면 이에 맞추어 별도 호출 및 수행한다.', async () => {
      const config = getConfigForAppendTest();
      const result = await service.makeAll(config, fileInfo);

      expect(result).toBe(1);
      expect(write).toBeCalledWith(
        `${config.base}/any/already/exists/${fileInfo.fullName}.ts`,
        `${fileInfo.featureName}.${fileInfo.subName}`,
        false
      );
      expect(append).toBeCalled();
    });
    it('append logic 이 등록되지 않은 알 수 없는 것일 경우 오류를 일으킨다.', async () => {
      const config = getConfigForAppendTest(true);

      await expect(service.makeAll(config, fileInfo)).rejects.toThrowError();

      expect(write).toBeCalledWith(
        `${config.base}/any/already/exists/${fileInfo.fullName}.ts`,
        `${fileInfo.featureName}.${fileInfo.subName}`,
        false
      );
      expect(append).toBeCalled();
    });
    it('템플릿이 없으면 덮어씌우기를 하지 않는다.', async () => {
      const config = getConfigForNoTemplateTest();

      const result = await service.makeAll(config, fileInfo);

      expect(result).toBe(1);
      expect(write).toBeCalledWith(
        `${config.base}/any/already/exists/${fileInfo.fullName}.ts`,
        '',
        false
      );
      expect(append).not.toBeCalled();
    });
  });

  describe('폴더 생성', () => {
    const { read, compile, write, append, appendLogic, mkdir } = createMockFn();
    const service = new CodeFileWriterService(
      read,
      compile,
      write,
      append,
      mkdir
    );
    const fileInfo = getFileInfo();

    afterEach(() => {
      compile.mockClear();
      read.mockClear();
      write.mockClear();
      append.mockClear();
      appendLogic.mockClear();
      mkdir.mockClear();
    });

    it('설정된 folders 내용을 기반으로 폴더 만들기를 수행한다.', async () => {
      const config = getConfigForFolderTest();
      const result = await service.makeAll(config, fileInfo);

      expect(result).toBe(4);
    });

    it('폴더 생성 시 지정된 base 경로 값을 활용한다.', async () => {
      const config = getConfigForFolderTest();

      await service.makeAll(config, fileInfo);

      expect(mkdir).toBeCalledWith(
        `someSrcPath/${fileInfo.featureName}/components`
      );
      expect(mkdir).toBeCalledWith(
        `someSrcPath/${fileInfo.featureName}/containers`
      );
      expect(mkdir).toBeCalledWith(`someSrcPath/${fileInfo.featureName}/pages`);
      expect(mkdir).toBeCalledWith(
        `someSrcPath/${fileInfo.featureName}/some/${fileInfo.subName}/elements`
      );
    });
  });
});
