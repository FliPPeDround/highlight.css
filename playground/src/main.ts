import HighlightCSS from 'highlight.css'

const hlcss = new HighlightCSS(
  document.getElementById('code'),
  {
    lang: 'js',
    theme: 'vitesse-black',
  },
)
await hlcss.render()
