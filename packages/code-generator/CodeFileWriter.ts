import {
  CodeGeneratorFileConfigDto,
  CodeGeneratorFolderConfigDto,
  CodeGeneratorPathConfigDto,
  DirectoryMakerFn,
  FeatureFileInfoDto,
  TemplateCompiler,
  TextFileAppendFn,
  TextFileReaderFn,
  TextFileWriterFn,
} from './types';
import { filterByExcludesCurried } from './utils';

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
    private append: TextFileAppendFn,
    private mkdir: DirectoryMakerFn
  ) {}

  async makeDirectory(
    basePath: string,
    folderInfo: CodeGeneratorFolderConfigDto,
    fileInfo: FeatureFileInfoDto
  ) {
    const destPath = await this.compile(
      `${basePath}/${folderInfo.folderName}`,
      fileInfo
    );

    await this.mkdir(destPath);

    return true;
  }

  async readFile(path: string | undefined) {
    if (!path) {
      return '';
    }
    return this.read(path);
  }

  async readTemplates(pathInfoList: CodeGeneratorFileConfigDto[]) {
    return await Promise.all(
      pathInfoList.map((item) => this.readFile(item.template))
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
    const hasTemplate = Boolean(template);
    const sourceCode = hasTemplate
      ? await this.compile(template, fileInfo)
      : '';
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

    await this.write(destPath, sourceCode, hasTemplate);
  }

  async makeAll(
    config: CodeGeneratorPathConfigDto,
    fileInfo: FeatureFileInfoDto
  ) {
    const { base, folders, files, excludes } = config;

    if (excludes && excludes.includes(fileInfo.featureName)) {
      return 0;
    }

    const templates = await this.readTemplates(files);
    const filterFn = filterByExcludesCurried(fileInfo.featureName);

    const fileResult = await Promise.all(
      files
        .filter(filterFn)
        .map((info, index) => this.make(base, info, templates[index], fileInfo))
    );

    if (!folders) {
      return fileResult.length;
    }

    const folderResult = await Promise.all(
      folders
        .filter(filterFn)
        .map((info) => this.makeDirectory(base, info, fileInfo))
    );

    return fileResult.length + folderResult.length;
  }
}
