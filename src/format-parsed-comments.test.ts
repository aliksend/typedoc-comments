import { describe, it } from 'node:test'
import assert from 'node:assert'
import { ParsedComment } from './comments-parser'
import { formatParsedComments } from './format-parsed-comments'

describe('formatParsedComments', () => {
  it('test 1', () => {
    const input: ParsedComment[] = [{
      type: 'comment',
      text: 'comment 1'
    }, {
      type: 'if',
      thisNodeHaveComment: false,
      condition: 'condition 1',
      thenComments: [{
        type: 'comment',
        text: 'then comment 1'
      }],
      elseComments: [{
        type: 'comment',
        text: 'else comment 1'
      }]
    }, {
      type: 'comment',
      text: 'comment 2'
    }, {
      type: 'if',
      thisNodeHaveComment: true,
      condition: 'condition 2',
      thenComments: [],
      elseComments: [{
        type: 'comment',
        text: 'else comment 2'
      }]
    }]

    const expectedResult = [
      '1. comment 1',
      '1. if condition 1',
      '\t1. then comment 1',
      '1. else',
      '\t1. else comment 1',
      '1. comment 2',
      '\t...',
      '1. else',
      '\t1. else comment 2'
    ]

    const actualResult = formatParsedComments(input)

    assert.deepStrictEqual(actualResult, expectedResult)
  })
})
