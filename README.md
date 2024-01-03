# Highlight.css

## Installation

```shell
npm install highlight.css
```

## Usage

```html
<pre id="code">
const foo = "bar"
</pre>

<script>
import HighlightCSS from 'highlight.css'

const highlight = new HighlightCSS(
  document.getElementById('code'),
  {
    lang: 'js',
    theme: 'vitesse-black',
  },
)

highlight.render()
</script>
```
