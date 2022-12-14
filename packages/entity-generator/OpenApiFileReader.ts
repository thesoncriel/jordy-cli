import { OpenAPIObject } from 'openapi3-ts';
import { PatternedFileReaderConfigDto } from '../common';

export interface OpenApiFileReader {
  read(
    config: PatternedFileReaderConfigDto
  ): Promise<Record<string, OpenAPIObject>>;
}

// export class YamlOpenApiFileReader implements OpenApiFileReader {
//   constructor(private fileReader: Fi) {}
//   async read(
//     config: PatternedFileReaderConfigDto
//   ): Promise<Record<string, OpenAPIObject>> {
//     config;
//   }
// }
