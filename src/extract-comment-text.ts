import { trimStartMultiline } from "./trim-start-multiline"

export function extractCommentText (str: string): string {
  const resLines: string[] = []

  const lines = str.split('\n')
  let inMultilineComment: false | true | 'jsdoc' = false
  for (const l of lines) {
    const endCommentIndex = l.indexOf('*/')
    if (inMultilineComment === true) {
      let lineToPush = l

      if (endCommentIndex !== -1) {
        inMultilineComment = false
        lineToPush = l.slice(0, endCommentIndex)
      }

      resLines.push(lineToPush)
      continue
    }

    if (inMultilineComment === 'jsdoc') {
      let lineToPush = l

      if (endCommentIndex !== -1) {
        inMultilineComment = false
        lineToPush = l.slice(0, endCommentIndex)
      }

      if (lineToPush.trimStart().startsWith('*')) {
        lineToPush = lineToPush.trimStart().slice(1)
      }
      resLines.push(lineToPush)
      continue
    }

    let startCommentIndex
    if (l.trim().startsWith('//')) {
      startCommentIndex = l.indexOf('//')
      resLines.push(l.slice(startCommentIndex + 2))
      continue
    }

    startCommentIndex = l.indexOf('/**')
    if (startCommentIndex !== -1) {
      if (endCommentIndex !== -1) {
        resLines.push(l.slice(startCommentIndex + 3, endCommentIndex).trim())
        continue
      }

      inMultilineComment = 'jsdoc'
      resLines.push(l.slice(startCommentIndex + 3).trim())
      continue
    }

    startCommentIndex = l.indexOf('/*')
    if (startCommentIndex !== -1) {
      if (endCommentIndex !== -1) {
        resLines.push(l.slice(startCommentIndex + 2, endCommentIndex).trim())
        continue
      }

      inMultilineComment = true
      resLines.push(l.slice(startCommentIndex + 2).trim())
      continue
    }
  }

  return trimStartMultiline(resLines).join('\n\n')
}
