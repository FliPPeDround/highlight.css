import HighlightCSS from 'highlight.css'

const codeEl = document.getElementById('code')!
const hlcss = new HighlightCSS(
  codeEl,
  {
    lang: 'js',
    theme: 'vitesse-dark',
  },
)
await hlcss.render()

codeEl?.addEventListener('click', async () => await hlcss.render())
