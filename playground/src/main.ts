import HighlightCSS from 'highlight.css'

const hlcss = new HighlightCSS(
  document.getElementById('code')?.firstChild,
  {
    lang: 'js',
    theme: 'min-dark',
  },
)
await hlcss.init()
