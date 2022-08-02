import { FeatureNameInfoDto } from './types';
import { toCapitalize } from './utils';

export class FeatureNameInfo implements FeatureNameInfoDto {
  private _featureNameAsPascalCase: string;
  private _fullNameAsPascalCase: string;
  private _fullName: string;

  get featureNameAsPascalCase() {
    return this._featureNameAsPascalCase;
  }
  get fullNameAsPascalCase() {
    return this._fullNameAsPascalCase;
  }
  get fullName() {
    return this._fullName;
  }

  constructor(
    public readonly featureName: string,
    public readonly subName: string = ''
  ) {
    const subNameAsPascalCase = toCapitalize(subName);

    this._featureNameAsPascalCase = toCapitalize(featureName);
    this._fullNameAsPascalCase = `${this._featureNameAsPascalCase}${subNameAsPascalCase}`;
    this._fullName = `${featureName}${subNameAsPascalCase}`;
  }

  toPlainObject(): FeatureNameInfoDto {
    const result: FeatureNameInfoDto = {
      featureName: this.featureName,
      featureNameAsPascalCase: this.featureNameAsPascalCase,
      fullName: this.fullName,
      fullNameAsPascalCase: this.fullNameAsPascalCase,
      subName: this.subName,
    };

    return result;
  }
}

export function createFeatureNameConfig(
  featureName: string,
  subName?: string
): FeatureNameInfoDto {
  return new FeatureNameInfo(featureName, subName).toPlainObject();
}
