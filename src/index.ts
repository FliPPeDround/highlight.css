import type { BundledTheme } from 'shikiji'
import { bundledThemes, codeToThemedTokens } from 'shikiji'

import { handleTab } from './eventHandlers.ts'

type ShikijitOptions = Parameters<typeof codeToThemedTokens>[1]

interface HighlightOptions extends ShikijitOptions {
  editable?: boolean
}

export default class HighlightCSS {
  private context: string = ''
  private highlightRanges: Map<string, Range[]> = new Map()
  private highlightsCSSContent: string = ''
  private styleEl: HTMLStyleElement | null = null

  public onRender?: () => void

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
    this.el.addEventListener('input', this.handleInput)
    this.el.addEventListener('keydown', handleTab)
  }

  private handleInput = async () => {
    this.el.normalize()
    await this.render()
  }

  // Check if CSS highlights are available
  private validateCSSHighlights() {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (!CSS.highlights)
      throw new Error('No highlights')
  }

  // Render the highlights
  public async render() {
    this.setContext()
    this.clearData()
    await this.setHighlightRanges()
    this.setElStyle()
    this.mountStyle()
    this.renderHighlight()
    this.onRender?.()
  }

  public destroy() {
    this.clearData()
    this.context = ''
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    CSS.highlights.clear()

    if (this.options.editable) {
      this.el.removeEventListener('input', this.handleInput)
      this.el.removeEventListener('keydown', handleTab)
      this.el.style.removeProperty('-webkit-user-modify')
    }

    if (this.styleEl) {
      document.head.removeChild(this.styleEl)
      this.styleEl = null
    }

    this.el.style.removeProperty('background-color')
    this.el.style.removeProperty('color')
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
      this.styleEl = document.createElement('style')
      document.head.appendChild(this.styleEl)
    }

    if (this.highlightsCSSContent !== this.styleEl.textContent)
      this.styleEl.textContent = this.highlightsCSSContent
  }

  private setElStyle() {
    const theme = this.options.theme
    bundledThemes[<BundledTheme>theme]().then((theme) => {
      const { background, foreground } = theme.default.tokenColors![0].settings
      this.el.style.setProperty('background-color', background!)
      this.el.style.setProperty('color', foreground!)
      this.el.style.setProperty('caret-color', foreground!)
    })
  }

  private clearData() {
    this.highlightRanges.clear()
    this.highlightsCSSContent = ''
  }
}
