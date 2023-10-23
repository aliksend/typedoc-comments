/**
 * Calc diff between two numbers
 *
 * @remarks
 * Much longer documentation here
 */
export function diff (a: number, b: number): number {

  if (a > b) {
    /**
     * sub b from a
     */
    return a - b
  }

  if (b < a) {
    a = b
  } else {
    // do nothing
    // and else
    /**
     * and one more comment
     */
    /** and other comment */
  }

  // is it will be printed? two

  /*
    sub a from b
  */
  /* yet another comment */
  /* strange
  multiline
  - comment
    - with
      - multiple
    - indents
  */
  return b - a

  // very last comment
}
