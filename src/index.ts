import { codeToThemedTokens } from 'shikiji'

// !TODO: set highlight options types
type HighlightOptions = any

export default class HighlightCSS {
  private context: string = ''
  private highlightRanges: Map<string, Range[]> = new Map()

  constructor(
    private readonly el: HTMLElement,
    private readonly options: HighlightOptions = {},
  ) {
  }

  setContext() {
    const context = this.el.textContent
    if (!context)
      throw new Error('No context')
    this.context = context
  }

  // checkHighlitCSS() {
  //   // eslint-disable-next-line ts/ban-ts-comment
  //   // @ts-nocheck
  //   if (!CSS.highlights)
  //     throw new Error('No highlights')
  // }

  async init() {
    // this.checkHighlitCSS()
    this.setContext()
    await this.setHighlightRanges()
    console.log(this.highlightRanges)
  }

  async setHighlightRanges() {
    const tokens = await codeToThemedTokens(this.context, this.options)
    let startPos = 0
    tokens.forEach((token) => {
      token.forEach((item) => {
        const { content, color } = item
        const index = this.context.indexOf(content, startPos)
        startPos = index + content.length
        const range = new Range()
        range.setStart(this.el, index)
        range.setEnd(this.el, startPos)
        // 如果是相同的color, 将range push到highlightRanges中
        if (this.highlightRanges.has(color!))
          this.highlightRanges.get(color!)!.push(range)

        else
          this.highlightRanges.set(color!, [range])
      })
    })
  }

  renderHighlight() {
    Object.entries(this.highlightRanges).forEach(([color, ranges]) => {
      const highlight = new Hightlight(...ranges)
      CSS.highlights.set(color, highlight)
    })
  }

  // 遍历highlightRanges的key,将key里的16位色值映射为对应的英文字母
  
}
