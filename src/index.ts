import { codeToThemedTokens } from 'shikiji'

type shikijitOptions = Parameters<typeof codeToThemedTokens>[1]

interface HighlightOptions extends shikijitOptions {
}

export default class HighlightCSS {
  private context: string = ''
  private highlightRanges: Map<string, Range[]> = new Map()
  private highlightsCSSContent: string = ''

  constructor(
    private readonly el: HTMLElement,
    private readonly options: HighlightOptions,
  ) {
    this.checkHighlitCSS()
  }

  setContext() {
    const context = this.el.textContent
    if (!context)
      throw new Error('No context')
    this.context = context
  }

  checkHighlitCSS() {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (!CSS.highlights)
      throw new Error('No highlights')
  }

  async render() {
    this.setContext()
    await this.setHighlightRanges()
    this.renderHighlight()
    this.mountStyle()
  }

  async setHighlightRanges() {
    const tokens = await codeToThemedTokens(this.context, this.options)
    let startPos = 0
    const nodes = this.el.firstChild!
    tokens.forEach((token) => {
      token.forEach((item) => {
        const { content, color } = item
        const index = this.context.indexOf(content, startPos)
        startPos = index + content.length
        const range = new Range()
        range.setStart(nodes, index)
        range.setEnd(nodes, startPos)
        // 如果是相同的color, 将range push到highlightRanges中
        if (this.highlightRanges.has(color!))
          this.highlightRanges.get(color!)!.push(range)

        else
          this.highlightRanges.set(color!, [range])
      })
    })
  }

  renderHighlight() {
    for (const [color, ranges] of this.highlightRanges) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      const highlight = new Highlight(...ranges)
      const highlightName = this.transformColor(color)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      CSS.highlights.set(highlightName, highlight)
      this.highlightsCSSContent += `
      ::highlight(${highlightName}) {
        color: ${color};
      }`
    }
  }

  // 遍历highlightRanges的key,将key里的16位色值映射为对应的英文字母
  transformColor(color: string) {
    const wordLits = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const colorHex = color.replace('#', '')
    const colorRGB = String(Number.parseInt(colorHex, 16))
    let result = ''

    for (const char of colorRGB)
      result += wordLits[Number(char)]

    return result
  }

  mountStyle() {
    const styleEl = document.createElement('style')
    styleEl.textContent = this.highlightsCSSContent
    document.head.appendChild(styleEl)
  }
}
