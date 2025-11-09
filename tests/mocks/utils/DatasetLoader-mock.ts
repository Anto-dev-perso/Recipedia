export type DatasetType = 'test' | 'production';

let mockDatasetType: DatasetType = 'test';

export function setMockDatasetType(type: DatasetType) {
  mockDatasetType = type;
}

export function getDatasetType(): DatasetType {
  return mockDatasetType;
}
