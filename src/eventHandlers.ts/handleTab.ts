// eslint-disable-next-line antfu/top-level-function
export const handleTab = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const selection = window.getSelection()
    if (!selection)
      return

    const range = selection.getRangeAt(0)
    const textNode = document.createTextNode('  ')
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.setEndAfter(textNode)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
