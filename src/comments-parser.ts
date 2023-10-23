import ts from 'typescript'
import { extractCommentText } from './extract-comment-text'

export type ParsedComment = {
  type: 'comment'
  text: string
} | {
  type: 'if'
  thisNodeHaveComment: boolean
  condition: string
  thenComments: ParsedComment[]
  elseComments: ParsedComment[]
} | {
  type: 'for'
  thisNodeHaveComment: boolean
  condition: string
  bodyComments: ParsedComment[]
} | {
  type: 'while'
  thisNodeHaveComment: boolean
  condition: string
  bodyComments: ParsedComment[]
}

export function parseComments(node: ts.Node, saveComments: boolean, alreadySavedComments: Array<{ start: number, end: number }>): ParsedComment[] {
  const res: ParsedComment[] = []

  let thisNodeHaveComment = false

  if (saveComments) {
    const comments = ts.getLeadingCommentRanges(node.getSourceFile().getFullText(), node.getFullStart());
    if (comments != null && comments.length !== 0) {
      for (const c of comments) {
        const found = alreadySavedComments.find((sc) => sc.start === c.pos && sc.end === c.end)
        if (found != null) {
          continue
        }
        alreadySavedComments.push({ start: c.pos, end: c.end })

        const text = extractCommentText(node.getSourceFile().getFullText().slice(c.pos, c.end))

        res.push({
          type: 'comment',
          text
        })
        thisNodeHaveComment = true
      }
    }
  }

  if (ts.isBlock(node)) {
    for (const c of node.getChildren()) {
      res.push(...parseComments(c, true, alreadySavedComments))
    }

    // this syntax ignores block, that contains only comments, and also skips last comments in blocks
    // ts.forEachChild(node, (node) => {
    //   res.push(...parseComments(node, true))
    // });
  } else if (node.kind === ts.SyntaxKind.SyntaxList) {
    for (const c of node.getChildren()) {
      res.push(...parseComments(c, true, alreadySavedComments))
    }
  } else if (ts.isIfStatement(node)) {
    res.push({
      type: 'if',
      thisNodeHaveComment,
      condition: node.expression.getFullText(),
      thenComments: parseComments(node.thenStatement, true, alreadySavedComments),
      elseComments: node.elseStatement != null ? parseComments(node.elseStatement, true, alreadySavedComments) : []
    })
  } else if (ts.isWhileStatement(node)) {
    res.push({
      type: 'while',
      thisNodeHaveComment,
      condition: node.expression.getFullText(),
      bodyComments: parseComments(node.statement, true, alreadySavedComments)
    })
  } else if (ts.isForInStatement(node) || ts.isForOfStatement(node)) {
    res.push({
      type: 'while',
      thisNodeHaveComment,
      condition: node.expression.getFullText(),
      bodyComments: parseComments(node.statement, true, alreadySavedComments)
    })
  } else if (ts.isForStatement(node)) {
    res.push({
      type: 'while',
      thisNodeHaveComment,
      condition: [
        node.initializer != null ? node.initializer.getFullText() : '',
        node.condition != null ? node.condition.getFullText() : '',
        node.incrementor != null ? node.incrementor.getFullText() : ''
      ].join('; '),
      bodyComments: parseComments(node.statement, true, alreadySavedComments)
    })
  } else if (ts.isFunctionDeclaration(node)) {
    ts.forEachChild(node, (node) => {
      res.push(...parseComments(node, false, alreadySavedComments))
    });
  }

  return res
}
