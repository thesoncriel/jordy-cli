import { toCapitalize } from '../common';
import {
  FeatureFileInfoDto,
  FeatureNameInfoDto,
  SimpleFileInfoDto,
} from './types';

export class FeatureFileInfo implements FeatureFileInfoDto {
  private _fileName: string;
  private _fileExt: string;
  private _fileNameAsPascalCase: string;

  get featureName() {
    return this.config.featureName;
  }
  get featureNameAsPascalCase() {
    return this.config.featureNameAsPascalCase;
  }
  get fullName() {
    return this.config.fullName;
  }
  get fullNameAsPascalCase() {
    return this.config.fullNameAsPascalCase;
  }

  private _storybookTitle: string;
  get storybookTitle() {
    if (!this._storybookTitle) {
      this._storybookTitle =
        Array.isArray(this.subNames) && this.subNames.length > 0
          ? `${this.featureName}/${this.subNames.join('/')}`
          : this.featureName;
    }

    return this._storybookTitle;
  }

  get subNames() {
    return this.config.subNames;
  }

  private _subPath: string;
  get subPath() {
    if (!this._subPath) {
      this._subPath = this.subNames.join('/');
    }

    return this._subPath;
  }

  get firstSubName() {
    if (this.subNames.length > 0) {
      return this.subNames[0];
    }
    return '';
  }

  get fileName() {
    return this._fileName;
  }
  get fileExt() {
    return this._fileExt;
  }
  get fileNameAsPascalCase() {
    return this._fileNameAsPascalCase;
  }

  constructor(private config: FeatureNameInfoDto, fileNameWithExt: string) {
    try {
      const parsedValue = this.parse(fileNameWithExt);

      this._fileName = parsedValue.fileName;
      this._fileExt = parsedValue.fileExt;
      this._fileNameAsPascalCase = parsedValue.fileNameAsPascalCase;
    } catch (error) {
      this._fileName = '';
      this._fileExt = '';
      this._fileNameAsPascalCase = '';
    }
  }

  parse(value: string): SimpleFileInfoDto {
    if (value && value.includes('.')) {
      const splittedValue = value.split('.');

      if (splittedValue.length === 2) {
        return {
          fileName: splittedValue[0],
          fileExt: splittedValue[1].toLowerCase(),
          fileNameAsPascalCase: toCapitalize(splittedValue[0]),
        };
      }
      if (splittedValue.length > 2) {
        const fileNameSource = splittedValue.slice(0, splittedValue.length - 1);

        return {
          fileName: fileNameSource.join('.'),
          fileExt: splittedValue[splittedValue.length - 1].toLowerCase(),
          fileNameAsPascalCase: fileNameSource.map(toCapitalize).join(''),
        };
      }
    }
    throw new Error(`"${value}" is not file name.`);
  }

  toPlainObject() {
    const result: FeatureFileInfoDto = {
      fileName: this.fileName,
      fileNameAsPascalCase: this.fileNameAsPascalCase,
      fileExt: this.fileExt,
      fullName: this.fullName,
      fullNameAsPascalCase: this.fullNameAsPascalCase,
      storybookTitle: this.storybookTitle,
      featureName: this.featureName,
      featureNameAsPascalCase: this.featureNameAsPascalCase,
      subNames: this.subNames,
      subPath: this.subPath,
      firstSubName: this.firstSubName,
    };
    return result;
  }
}
