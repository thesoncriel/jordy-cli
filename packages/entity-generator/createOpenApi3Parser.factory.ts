import { EntityGeneratorConfigDto } from '../common';
import { OpenApi3Parser, OpenApiObjectParser } from './OpenApi3Parser';

export function createOpenApi3Parser(
  config: EntityGeneratorConfigDto
): OpenApi3Parser {
  return new OpenApiObjectParser(config);
}
