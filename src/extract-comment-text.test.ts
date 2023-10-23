import { extractCommentText } from './extract-comment-text'
import { describe, it } from 'node:test'
import assert from 'node:assert'

describe('extractCommentText', () => {
  it('table test', () => {
    const cases = [
      { lines: [], result: [] },
      { lines: [''], result: [] },
      { lines: ['//'], result: [] },
      { lines: ['/* */'], result: [] },
      { lines: ['/*', '*/'], result: [] },
      { lines: ['// comment 1'], result: ['comment 1'] },
      { lines: ['// comment 1', '// comment 2'], result: ['comment 1', 'comment 2'] },
      { lines: ['// comment 1', '//   comment 2'], result: ['comment 1', '\tcomment 2'] },
      { lines: ['/*comment 1*/'], result: ['comment 1'] },
      { lines: ['/* comment 1 */'], result: ['comment 1'] },
      { lines: ['/*', 'comment 1', '*/'], result: ['comment 1'] },
      { lines: ['/*', '  comment 1', '*/'], result: ['comment 1'] },
      { lines: ['/**', '* comment 1', '*/'], result: ['comment 1'] },
      { lines: ['/**', '* comment 1', '* */'], result: ['comment 1'] },
    ]

    for (const { lines, result: expectedResult } of cases) {
      const actualResult = extractCommentText(lines.join('\n'))
      assert.deepStrictEqual(actualResult, expectedResult.join('\n\n'))
    }
  })
})
