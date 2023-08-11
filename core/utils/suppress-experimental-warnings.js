/**
 * This will prevent specific experimental warnings from being logged
 * to the console. For example if in Node 18 you are using the now native
 * fetch, you will see a warning about it.
 * To suppress this warning:
 *
 * import suppressWarnings from './suppress-experimental-warnings';
 * suppressWarnings.fetch();
 */
import process from 'process';
const originalEmit = process.emit;

export default {
  fetch: function () {
    process.emit = function (name, data) {
      if (
        name === 'warning' &&
        typeof data === 'object' &&
        data.name === 'ExperimentalWarning' &&
        data.message.includes('The Fetch API is an experimental feature')
      ) {
        return false;
      }
      return originalEmit.apply(process, arguments);
    };
  },
};
