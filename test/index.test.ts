import { describe, expect, it } from 'vitest'
import { codeToThemedTokens } from 'shikiji'

describe('should', () => {
  it('exported', async () => {
    const tokens = await codeToThemedTokens(`<div class="foo">bar</div>
    <div class="foo">bar</div>`, {
      lang: 'html',
      theme: 'min-dark',
    })
    expect(tokens).toMatchInlineSnapshot(`
      [
        [
          {
            "color": "#B392F0",
            "content": "<",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": "div",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": " class",
            "fontStyle": 0,
          },
          {
            "color": "#F97583",
            "content": "=",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": ""foo"",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": ">bar</",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": "div",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": ">",
            "fontStyle": 0,
          },
        ],
        [
          {
            "color": "#B392F0",
            "content": "    <",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": "div",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": " class",
            "fontStyle": 0,
          },
          {
            "color": "#F97583",
            "content": "=",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": ""foo"",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": ">bar</",
            "fontStyle": 0,
          },
          {
            "color": "#FFAB70",
            "content": "div",
            "fontStyle": 0,
          },
          {
            "color": "#B392F0",
            "content": ">",
            "fontStyle": 0,
          },
        ],
      ]
    `)
  })
})
