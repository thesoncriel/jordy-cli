import { FeatureNameInfoDto } from './types';
import { toCapitalize } from './utils';

export class FeatureNameInfo implements FeatureNameInfoDto {
  private _featureNameAsPascalCase: string;
  private _fullNameAsPascalCase: string;
  private _fullName: string;
  private _storybookTitle: string;
  private _subPath = '';
  private _firstSubName = '';

  get featureNameAsPascalCase() {
    return this._featureNameAsPascalCase;
  }
  get fullNameAsPascalCase() {
    return this._fullNameAsPascalCase;
  }
  get fullName() {
    return this._fullName;
  }
  get storybookTitle() {
    return this._storybookTitle;
  }
  public get subPath(): string {
    return this._subPath;
  }
  public get firstSubName(): string {
    return this._firstSubName;
  }

  constructor(
    public readonly featureName: string,
    public readonly subNames: string[] = []
  ) {
    const subNameAsPascalCase = toCapitalize(subNames);

    this._featureNameAsPascalCase = toCapitalize(featureName);
    this._fullNameAsPascalCase = `${this._featureNameAsPascalCase}${subNameAsPascalCase}`;
    this._fullName = `${featureName}${subNameAsPascalCase}`;
    this._storybookTitle = featureName;

    if (Array.isArray(subNames) && subNames.length > 0) {
      this._subPath = subNames.join('/');
      this._firstSubName = subNames[0];

      this._storybookTitle = `${featureName}/${this._subPath}`;
    }
  }

  toPlainObject(): FeatureNameInfoDto {
    const result: FeatureNameInfoDto = {
      featureName: this.featureName,
      featureNameAsPascalCase: this.featureNameAsPascalCase,
      fullName: this.fullName,
      fullNameAsPascalCase: this.fullNameAsPascalCase,
      storybookTitle: this.storybookTitle,
      subNames: this.subNames,
      subPath: this.subPath,
      firstSubName: this.firstSubName,
    };

    return result;
  }
}

export function createFeatureNameInfo(
  featureName: string,
  subName?: string[]
): FeatureNameInfoDto {
  return new FeatureNameInfo(featureName, subName).toPlainObject();
}
