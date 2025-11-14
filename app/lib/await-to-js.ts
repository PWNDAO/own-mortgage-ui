// import * as Sentry from '@sentry/vue'
/**
 * @param { Promise } promise
 * @param { Object= } errorConfig - Additional Information you can pass to the err object
 * @return { Promise }
 */
type ErrorConfig = { additionalErrorInfo?: Record<string, unknown>, enableLogging?: boolean }

export function to<T, U extends Error = Error> (
  promise: Promise<T>,
  { additionalErrorInfo = {}, enableLogging = true }: ErrorConfig = { additionalErrorInfo: {}, enableLogging: true },
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (enableLogging && err.name !== 'AbortError') {
        console.error('Error in await-to-js:')
        console.error(err)
        console.info('Additional error info:')
        console.info(additionalErrorInfo)
        // Sentry.captureException(err, { contexts: { additionalErrorInfo } })
      }
      return [err, undefined]
    })
}
export default to
