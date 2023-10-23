import { describe, it } from 'node:test'
import assert from 'node:assert'
import { trimStartMultiline } from './trim-start-multiline'

describe('trimStartMultiline', () => {
  it('table test', () => {
    const cases = [
      { lines: [], result: [] },
      { lines: [''], result: [''] },
      { lines: [' a'], result: ['a'] },
      { lines: [' a', '  b'], result: ['a', '\tb'] },
      { lines: [' ', '  a', '   b', ' '], result: ['a', '\tb'] },
      { lines: [' ', '  a', '', '   b', 'c', ' '], result: ['\ta', '', '\t\tb', 'c'] },
    ]

    for (const { lines, result: expectedResult } of cases) {
      const actualResult = trimStartMultiline(lines)
      assert.deepStrictEqual(actualResult, expectedResult)
    }
  })
})
