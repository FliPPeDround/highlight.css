import HighlightCSS from 'highlight.css'

const codeEl = document.getElementById('code')!
const hlcss = new HighlightCSS(
  codeEl,
  {
    lang: 'js',
    theme: 'vitesse-black',
  },
)
await hlcss.render()

codeEl?.addEventListener('input', async () => await hlcss.render())
