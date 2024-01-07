import HighlightCSS from 'highlight.css'

const codeEl = document.getElementById('code')!
const hlcss = new HighlightCSS(
  codeEl,
  {
    lang: 'js',
    theme: 'vitesse-dark',
    editable: true,
  },
)

await hlcss.render()
