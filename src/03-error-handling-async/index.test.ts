import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve number value', async () => {
    const value = 42;
    const result = await resolveValue(value);
    expect(result).toBe(value);
  });

  test('should resolve string value', async () => {
    const stringValue = 'Hello, World!';
    const stringResult = await resolveValue(stringValue);
    expect(stringResult).toBe(stringValue);
  });

  test('should resolve object value', async () => {
    const objectValue = { key: 'value' };
    const objectResult = await resolveValue(objectValue);
    expect(objectResult).toEqual(objectValue);
  });

  test('should resolve null value', async () => {
    const nullValue = null;
    const nullResult = await resolveValue(nullValue);
    expect(nullResult).toBe(null);
  });

  test('should resolve undefined value', async () => {
    const undefinedValue = undefined;
    const undefinedResult = await resolveValue(undefinedValue);
    expect(undefinedResult).toBe(undefined);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'This is a custom error message';
    expect(() => throwError(errorMessage)).toThrow(Error);
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrow(Error);
    expect(throwError).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrow(MyAwesomeError);
    expect(throwCustomError).toThrow('This is my awesome custom error!');
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
