import { codeToThemedTokens } from 'shikiji'

type ShikijitOptions = Parameters<typeof codeToThemedTokens>[1]

interface HighlightOptions extends ShikijitOptions {
}

export default class HighlightCSS {
  private context: string = ''
  private highlightRanges: Map<string, Range[]> = new Map()
  private highlightsCSSContent: string = ''

  constructor(
    private readonly el: HTMLElement,
    private readonly options: HighlightOptions,
  ) {
    this.validateCSSHighlights()
  }

  // Set the context based on the element's text content
  private setContext() {
    const context = this.el.textContent
    if (!context)
      throw new Error('No context')
    this.context = context
  }

  // Check if CSS highlights are available
  private validateCSSHighlights() {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (!CSS.highlights)
      throw new Error('No highlights')
  }

  // Render the highlights
  async render() {
    this.setContext()
    this.clearData()
    await this.setHighlightRanges()
    this.renderHighlight()
    this.mountStyle()
  }

  // Set the highlight ranges based on the tokens
  private async setHighlightRanges() {
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
        // If the color is the same, push the range to highlightRanges
        if (this.highlightRanges.has(color!))
          this.highlightRanges.get(color!)!.push(range)

        else
          this.highlightRanges.set(color!, [range])
      })
    })
  }

  // Render the highlights based on the highlight ranges
  private renderHighlight() {
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

  // Transform the color value to a corresponding string
  private transformColor(color: string) {
    const wordLits = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const colorHex = color.replace('#', '')
    const colorRGB = String(Number.parseInt(colorHex, 16))
    let result = ''

    for (const char of colorRGB)
      result += wordLits[Number(char)]

    return result
  }

  // Mount the style element to the document head
  private mountStyle() {
    const styleEl = document.getElementById('var-highlight-css') ?? document.createElement('style')
    styleEl.id = 'var-highlight-css'
    styleEl.textContent = this.highlightsCSSContent
    document.head.appendChild(styleEl)
  }

  private clearData() {
    this.highlightRanges.clear()
    this.highlightsCSSContent = ''
  }
}
