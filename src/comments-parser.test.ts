import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import ts from 'typescript'
import { ParsedComment, parseComments } from './comments-parser'

describe('parseComments', () => {
  it('test 1', () => {
    const sourceFile = ts.createSourceFile('parseComments_1.ts', fs.readFileSync('./test/parseComments_1.ts', 'utf-8'), ts.ScriptTarget.Latest, true);
    const res: ParsedComment[] = []
    ts.forEachChild(sourceFile, (node) => {
      const comments = parseComments(node, false, [])
      res.push(...comments)
    })

    assert.deepStrictEqual(res, [
      {
        type: 'if',
        thisNodeHaveComment: false,
            condition: 'a > b',
            thenComments: [
              {
                text: 'sub b from a',
                type: 'comment'
              }
            ],
            elseComments: []
          },
          {
            type: 'if',
            thisNodeHaveComment: false,
            condition: 'b < a',
            thenComments: [],
            elseComments: [
              {
                text: 'do nothing',
                type: 'comment'
              },
              {
                text: 'and else',
                type: 'comment'
              },
              {
                text: 'and one more comment',
                type: 'comment'
              },
              {
                text: 'and other comment',
                type: 'comment'
              }
            ],
          },
          {
            type: 'comment',
            text: 'is it will be printed? two',
          },
          {
            type: 'comment',
            text: 'sub a from b',
          },
          {
            type: 'comment',
            text: 'yet another comment',
          },
            {
              type: 'comment',
              text: ['strange', '\tmultiline', '\t- comment', '\t\t- with', '\t\t\t- multiple', '\t\t- indents'].join('\n\n'),
            },
            {
              type: 'comment',
              text: 'very last comment',
              }
    ])
  })
})
