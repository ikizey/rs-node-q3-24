import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(timeout);
    expect(timeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    const intervalSpy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, interval);

    expect(intervalSpy).toHaveBeenCalledWith(callback, interval);

    callback.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval * 3);
    expect(callback).toHaveBeenCalledTimes(3);

    callback.mockRestore();
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'mockFile.txt';
  const mockFullPath = '/full/path/to/mockFile.txt';
  const mockFileContent = 'File content';

  beforeEach(() => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(mockFilePath);
    expect(join).toHaveBeenCalledWith(__dirname, mockFilePath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));

    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBe(mockFileContent);
  });
});
