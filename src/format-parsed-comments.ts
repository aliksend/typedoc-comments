import { ParsedComment } from "./comments-parser"

function genPrefixForIndent(indent: number): string {
  return new Array(indent).fill('\t').join('')
}

export function formatParsedComments(comments: ParsedComment[], indent: number = 0): string[] {
  const prefix = genPrefixForIndent(indent) + '1. '
  const res: string[] = []
  for (const c of comments) {
    switch (c.type) {
      case 'comment':
        res.push(`${prefix}${c.text.split('\n').map((v, index) => index === 0 ? v : `\t${v}`).join('\n')}`)
        break
      case 'if':
        if (c.thenComments.length === 0 && c.elseComments.length === 0) {
          break
        }

        if (!c.thisNodeHaveComment) {
          res.push(`${prefix}if ${c.condition}`)
        }
        if (c.thenComments.length !== 0) {
          res.push(...formatParsedComments(c.thenComments, indent + 1))
        } else {
          res.push(`${genPrefixForIndent(indent + 1)}...`)
        }

        if (c.elseComments?.length !== 0) {
          res.push(`${prefix}else`)
          res.push(...formatParsedComments(c.elseComments, indent + 1))
        }
        break
      case 'for':
        if (c.bodyComments.length === 0) {
          break
        }

        if (!c.thisNodeHaveComment) {
          res.push(`${prefix}for ${c.condition}`)
        }
        res.push(...formatParsedComments(c.bodyComments, indent + 1))
        break
      case 'while':
        if (c.bodyComments.length === 0) {
          break
        }

        if (!c.thisNodeHaveComment) {
          res.push(`${prefix}while ${c.condition}`)
        }
        res.push(...formatParsedComments(c.bodyComments, indent + 1))
        break
    }
  }
  return res
}
