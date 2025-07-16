/**
 * A type that represents a generic object with string keys
 */
export type StringRecord = Record<string, unknown>;

/**
 * A type that represents a generic object with string keys and any value
 * Use this instead of any when you need to represent an object with unknown structure
 */
export type GenericObject = Record<string, unknown>;

/**
 * A type that represents a generic function
 */
export type GenericFunction = (...args: unknown[]) => unknown;

/**
 * A type that represents a generic async function
 */
export type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

/**
 * A type that represents a generic event handler
 */
export type EventHandler = (event: unknown) => void;

/**
 * A type that represents a generic error
 */
export type GenericError = Error | unknown;

/**
 * A type that represents a generic response
 */
export type GenericResponse = Response | unknown;

/**
 * A type that represents a generic request
 */
export type GenericRequest = Request | unknown;

/**
 * A type that represents a generic data object
 */
export type DataObject = {
  [key: string]: unknown;
};

/**
 * A type that represents a generic API response
 */
export type ApiResponse<T = unknown> = {
  data?: T;
  error?: GenericError;
  status: number;
  message?: string;
};

/**
 * A type that represents a generic API request
 */
export type ApiRequest<T = unknown> = {
  data?: T;
  params?: StringRecord;
  headers?: StringRecord;
};

/**
 * A type that represents a generic API configuration
 */
export type ApiConfig = {
  baseURL?: string;
  headers?: StringRecord;
  timeout?: number;
  withCredentials?: boolean;
}; 