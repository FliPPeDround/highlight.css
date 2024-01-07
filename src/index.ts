import type { BundledTheme } from 'shikiji'
import { bundledThemes, codeToThemedTokens } from 'shikiji'

type ShikijitOptions = Parameters<typeof codeToThemedTokens>[1]

interface HighlightOptions extends ShikijitOptions {
  editable?: boolean
}

export default class HighlightCSS {
  private context: string = ''
  private highlightRanges: Map<string, Range[]> = new Map()
  private highlightsCSSContent: string = ''
  private styleEl: HTMLStyleElement | null = null

  public loading = true

  constructor(
    private readonly el: HTMLElement,
    private readonly options: HighlightOptions,
  ) {
    this.validateCSSHighlights()
    if (this.options.editable)
      this.domEditable()
  }

  // Set the context based on the element's text content
  private setContext() {
    const context = this.el.textContent
    if (!context)
      throw new Error('No context')
    this.context = context
  }

  private domEditable() {
    this.el.style.setProperty('-webkit-user-modify', 'read-write-plaintext-only')
    this.el.addEventListener('input', async () => {
      this.el.normalize()
      await this.render()
    })
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
    this.loading = true
    this.setContext()
    this.clearData()
    await this.setHighlightRanges()
    this.setElStyle()
    this.mountStyle()
    this.renderHighlight()
    this.loading = false
  }

  // Set the highlight ranges based on the tokens
  private async setHighlightRanges() {
    const tokens = await codeToThemedTokens(this.context, this.options)

    let startPos = -1
    const nodes = this.el.firstChild
    if (!nodes)
      throw new Error('The first child of the element is not available.')

    for (let i = 0; i < tokens.length; i++) {
      startPos += 1
      for (let j = 0; j < tokens[i].length; j++) {
        const token = tokens[i][j]
        const { content, color } = token
        const index = startPos
        startPos += content.length
        if (!content.trim())
          continue
        const range = new Range()
        range.setStart(nodes, index)
        range.setEnd(nodes, startPos)
        const ranges = this.highlightRanges.get(color!)
        if (ranges) {
          ranges.push(range)
        }
        else {
          this.highlightRanges.set(color!, [range])
          this.highlightsCSSContent += `
          ::highlight(c-${color!.substring(1)}) {
            color: ${color};
          }`
        }
      }
    }
  }

  // Render the highlights based on the highlight ranges
  private renderHighlight() {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    CSS.highlights.clear()
    for (const [color, ranges] of this.highlightRanges) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      const highlight = new Highlight(...ranges)
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      CSS.highlights.set(`c-${color.substring(1)}`, highlight)
    }
  }

  // Mount the style element to the document head
  private mountStyle() {
    if (!this.styleEl) {
      this.styleEl = <HTMLStyleElement>document.getElementById('var--highlight-css__code')
        || this.createStyleElement()
    }
    if (this.highlightsCSSContent !== this.styleEl.textContent)
      this.styleEl.textContent = this.highlightsCSSContent
  }

  private createStyleElement(): HTMLStyleElement {
    const styleEl = document.createElement('style')
    styleEl.id = 'var--highlight-css__code'
    document.head.appendChild(styleEl)
    return styleEl
  }

  private setElStyle() {
    const theme = this.options.theme
    bundledThemes[<BundledTheme>theme]().then((theme) => {
      const { background, foreground } = theme.default.tokenColors![0].settings
      this.el.style.setProperty('background-color', background!)
      this.el.style.setProperty('color', foreground!)
    })
  }

  private clearData() {
    this.highlightRanges.clear()
    this.highlightsCSSContent = ''
  }
}
