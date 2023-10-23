# typedoc-comments

Thin plugin adds comments from your function to its doc

example.ts:
```typescript
/**
 * Finds min
 */
function min(elements: number[]): number {
  /*
    First of all, set result to maximum available number
    to replace it with actual value on first iteration
  */
  let res = Infinity

  // Iterate over provided elements
  for (const el of elements) {
    if (el < res) {
      // Store value as result
      res = el
    }
  }

  // Return result
  return res
}
```

Run using
```bash
typedoc --plugin typedoc-comments example.ts
```

Will provide documentation like

```
1. First of all, set result to maximum available number
  to replace it with actual value on first iteration

2. Iterate over provided elements

    1. if el < res

        1.Store value as result

3. Return result
```
