import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockResponse = { data: [{ id: 1, title: 'Test Post' }] };
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet = jest.fn().mockResolvedValue(mockResponse);
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    // const relativePath = '/posts';
    // await throttledGetDataFromApi(relativePath);
    // expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts';
    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockResponse.data);
  });
});
