import { PatternedFilePathGetterFn, TextFileReaderFn } from '../types';
import { DataFileReader, YamlDataFileReader } from './DataFileReader';

interface TestMockDto {
  pseudoYaml: boolean;
  name: string;
  pet: string;
  status: string;
  age: number;
}

describe('YamlDataFileReader', () => {
  const mockFileReader = vi.fn().mockResolvedValue('pseudoYaml: true');
  const mockFilePathGetter = vi
    .fn()
    .mockResolvedValue([
      '/home/prj/lookpin/api/blahblah.yaml',
      '/home/prj/lookpin/api/pome.yaml',
      '/home/prj/lookpin/api/jordy.yaml',
    ]);
  const mockYamlParser = vi.fn().mockResolvedValue({
    pseudoYaml: true,
    name: 'lookpin',
    pet: 'jordy',
    status: 'laugh!',
    age: 29,
  });

  function createDataFileReader() {
    return new YamlDataFileReader<TestMockDto>(
      mockFileReader,
      mockFilePathGetter,
      mockYamlParser
    );
  }

  let reader = createDataFileReader();

  afterEach(() => {
    mockFileReader.mockClear();
    mockFilePathGetter.mockClear();
    mockYamlParser.mockClear();
    reader = createDataFileReader();
  });

  it('음 동작?', async () => {
    const result = await reader.readByPattern({
      folderPath: '/home/prj/lookpin/api',
    });
  });
});
