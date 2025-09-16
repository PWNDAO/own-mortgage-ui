export type Timestamp = number
export type Nullable<T> = T | null
export type UnixTimestamp = number // in seconds
export type AnyFunction = (...args: never[]) => unknown
export type CompareFunctionReturn = -1 | 0 | 1
export type HexString = string
export type HexColor = `#${string}`
export type IntervalId = ReturnType<typeof setInterval | typeof setTimeout>

// inspired from here https://github.com/Microsoft/TypeScript/issues/19244#issuecomment-337304049
export type Stringified<T> = string & {
  [P in keyof T]: { '_ value': T[P] }
};

declare global {
  interface JSON {
    stringify<T>(value: T, replacer?: (key: string, value: unknown) => unknown, space?: string | number): string & Stringified<T>;
    stringify(value: unknown, replacer?: (key: string, value: unknown) => unknown, space?: string | number): string;
    parse<T>(text: Stringified<T>, reviver?: (key: unknown, value: unknown) => unknown): T;
    parse(text: string, reviver?: (key: unknown, value: unknown) => unknown): unknown;
  }
}

// most commonly used when parsing a response from BE
// to allow passing of null property values to constructor
export type PartialAllowNulls<T> = {
  [P in keyof T]?: T[P] | null
}

export type PartialWithRequired<T, K extends keyof T> = Partial<Pick<T, Exclude<keyof T, K>>> & Required<Pick<T, K>>;
