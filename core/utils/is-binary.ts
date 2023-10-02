/**
 * The utilities in this file are based on the NPM module `istextorbinary`.
 *
 * The implementation is copied here to reduce dependency overhead
 * and improve compatibility with NodeJS compilers like `@vercel/ncc`.
 *
 * @see the `LICENSE` file at the root of this source tree:
 *   https://github.com/bevry/istextorbinary/blob/master/source/index.ts
 */

import type Buffer from 'buffer';
import * as pathUtil from 'path';
import textExtensions from 'textextensions';
import binaryExtensions from 'binaryextensions';

/**
 * Determine if the filename and/or buffer is text.
 *
 * Determined by extension checks first (if filename is available), otherwise if
 * the extension is unrecognized or no filename is provided, will perform a
 * slower buffer encoding detection.
 *
 * Extension checks are quicker.
 * Encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 *
 * The extension checks are performed using the following resources:
 *   - https://github.com/bevry/textextensions
 *   - https://github.com/bevry/binaryextensions
 *
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a `boolean` value with the detection result.
 */
function isText(filename?: string | null, buffer?: Buffer | null): boolean | null {
  // Test extensions
  if (filename) {
    // Extract filename
    const parts = pathUtil.basename(filename).split('.').reverse();

    // Cycle extensions
    for (const extension of parts) {
      if (textExtensions.includes(extension)) {
        return true;
      }
      if (binaryExtensions.includes(extension)) {
        return false;
      }
    }
  }

  // Fallback to encoding if extension check was not enough
  if (buffer) {
    return getEncoding(buffer) === 'utf8';
  }

  // No buffer was provided
  return null;
}

interface EncodingOpts {
  /**
   * Defaults to 24.
   */
  chunkLength?: number;

  /**
   * If not provided, will check the start, beginning, and end.
   */
  chunkBegin?: number;
}

/**
 * Get the encoding of a buffer.
 *
 * Checks the start, middle, and end of the buffer for characters that are
 * unrecognized within UTF8 encoding. History has shown that inspection at all
 * three locations is necessary.
 *
 * @returns Will be `null` if `buffer` was not provided. Otherwise will be either `'utf8'` or `'binary'`.
 */
function getEncoding(buffer: Buffer | null, opts?: EncodingOpts): 'utf8' | 'binary' | null {
  // Check
  if (!buffer) return null;

  // Prepare
  const textEncoding = 'utf8';
  const binaryEncoding = 'binary';
  const chunkLength = opts?.chunkLength ?? 24;
  let chunkBegin = opts?.chunkBegin ?? 0;

  // Discover
  if (opts?.chunkBegin == null) {
    // Start
    let encoding = getEncoding(buffer, { chunkLength, chunkBegin });
    if (encoding === textEncoding) {
      // Middle
      chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength);
      encoding = getEncoding(buffer, {
        chunkLength,
        chunkBegin,
      });
      if (encoding === textEncoding) {
        // End
        chunkBegin = Math.max(0, buffer.length - chunkLength);
        encoding = getEncoding(buffer, {
          chunkLength,
          chunkBegin,
        });
      }
    }

    // Return
    return encoding;
  }
  // Extract
  const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength);
  const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd);

  // Detect encoding
  for (let i = 0; i < contentChunkUTF8.length; ++i) {
    const charCode = contentChunkUTF8.charCodeAt(i);
    if (charCode === 65533 || charCode <= 8) {
      // 8 and below are control characters (e.g. backspace, null, eof, etc.)
      // 65533 is the unknown character
      // console.log(charCode, contentChunkUTF8[i])
      return binaryEncoding;
    }
  }

  // Return
  return textEncoding;
}

/**
 * Determine if the filename and/or buffer is binary.
 *
 * Determined by extension checks first (if filename is available), otherwise if
 * the extension is unrecognized or no filename is provided, will perform a
 * slower buffer encoding detection.
 *
 * Extension checks are quicker.
 * Encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 *
 * The extension checks are performed using the following resources:
 *   - https://github.com/bevry/textextensions
 *   - https://github.com/bevry/binaryextensions
 *
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a `boolean` value with the detection result.
 */
export function isBinary(filename?: string | null, buffer?: Buffer | null) {
  const text = isText(filename, buffer);
  if (text == null) return null;
  return !text;
}
