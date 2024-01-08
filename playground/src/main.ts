import HighlightCSS from 'highlight.css'

const codeEl = document.getElementById('code')!
const hlcss = new HighlightCSS(
  codeEl,
  {
    lang: 'js',
    theme: 'vitesse-light',
    editable: true,
  },
)

await hlcss.render()

// setTimeout(() => {
//   hlcss.destroy()
// }, 5000)
