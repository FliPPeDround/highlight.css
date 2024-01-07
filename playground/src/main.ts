import HighlightCSS from 'highlight.css'

const codeEl = document.getElementById('code')!
const hlcss = new HighlightCSS(
  codeEl,
  {
    lang: 'js',
    theme: 'vitesse-dark',
    editor: true,
  },
)

await hlcss.render()
