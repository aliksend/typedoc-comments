import { Application, CommentTag, Converter } from 'typedoc';
import { parseComments } from './comments-parser';
import { formatParsedComments } from './format-parsed-comments';

export function load(app: Application) {
  app.converter.on(Converter.EVENT_CREATE_SIGNATURE, (context: any, refl: any, node: any) => {
    if (node == null) {
      return
    }
    const comments = parseComments(node, false, [])
    if (comments.length === 0) {
      return
    }

    const text = formatParsedComments(comments).join('\n\n')

    refl.comment.blockTags.push(new CommentTag('@remarks', [{
      kind: 'text',
      text
    }]))
  })
}
