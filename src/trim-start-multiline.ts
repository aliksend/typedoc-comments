export function trimStartMultiline (lines: string[]): string[] {
  const resLines: Array<{ text: String, indentation?: number }> = []

  const indentations = new Set<number>()

  let minSpacesAtStart = Infinity
  for (const l of lines) {
    // if line is empty then don't count its spaces as indentation
    if (l.trim() === '') {
      resLines.push({ text: l })
      continue
    }

    let spacesAtStart = 0

    const m = l.match(/^(\s*)/)
    if (m != null) {
      spacesAtStart = m[1].length
    }

    resLines.push({
      indentation: spacesAtStart,
      text: l.trim()
    })
    indentations.add(spacesAtStart)
    if (spacesAtStart < minSpacesAtStart) {
      minSpacesAtStart = spacesAtStart
    }
  }
  const indentationsStr = Array.from(indentations).sort().reduce((res, item, index) => {
    res.set(item, new Array(index).fill('\t').join(''))
    return res
  }, new Map<number, string>())
  return trimFirstAndLastEmptyLines(resLines.map((l) => `${l.indentation != null ? indentationsStr.get(l.indentation) : ''}${l.text}`))
}

function trimFirstAndLastEmptyLines (lines: string[]): string[] {
  let start = 0
  let end = lines.length - 1
  while (start < end && lines[start].trim() === '') {
    start += 1
  }
  while (start < end && lines[end].trim() === '') {
    end -= 1
  }

  return lines.slice(start, end + 1)
}
