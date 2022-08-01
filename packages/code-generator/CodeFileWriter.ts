import {
  CodeGeneratorFileConfigDto,
  CodeGeneratorPathConfigDto,
  FeatureFileInfoDto,
  TemplateCompiler,
  TextFileAppendFn,
  TextFileReaderFn,
  TextFileWriterFn,
} from './types';

export interface CodeFileWriter {
  makeAll(
    config: CodeGeneratorPathConfigDto,
    fileInfo: FeatureFileInfoDto
  ): Promise<number>;
}

export class CodeFileWriterService implements CodeFileWriter {
  constructor(
    private read: TextFileReaderFn,
    private compile: TemplateCompiler,
    private write: TextFileWriterFn,
    private append: TextFileAppendFn
  ) {}

  async readTemplates(pathInfoList: CodeGeneratorFileConfigDto[]) {
    return await Promise.all(
      pathInfoList.map((item) => this.read(item.template))
    );
  }

  async make(
    basePath: string,
    featInfo: CodeGeneratorFileConfigDto,
    template: string,
    fileInfo: FeatureFileInfoDto
  ) {
    const destPath = await this.compile(
      `${basePath}/${featInfo.fileName}`,
      fileInfo
    );
    const sourceCode = await this.compile(template, fileInfo);
    const { appendLogic } = featInfo;

    if (appendLogic) {
      try {
        await this.write(destPath, sourceCode, false);

        return;
      } catch (error) {
        if (error instanceof Error && error.message.includes('exists')) {
          await this.append(destPath, sourceCode, fileInfo, appendLogic);

          return;
        }
        throw error;
      }
    }

    await this.write(destPath, sourceCode, true);
  }

  async makeAll(
    config: CodeGeneratorPathConfigDto,
    fileInfo: FeatureFileInfoDto
  ) {
    const templates = await this.readTemplates(config.files);

    const result = await Promise.all(
      config.files.map((info, index) =>
        this.make(config.base, info, templates[index], fileInfo)
      )
    );

    return result.length;
  }
}
