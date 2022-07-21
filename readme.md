# NovaLightshow
> *Lightshow anew!*

A website to preview how a TextMate grammar will apply syntax highlighting to associated files on GitHub.

A replacement for the now-defunct GitHub Lightshow.

Supports JSON, YAML, and XML PList grammars.

---

> [**Try it out!**](https://novalightshow.netlify.app)

---

## URL API
> `https://novalightshow.netlify.app/?grammar-type={text|url}&grammar=<content|url>&sample-type={text|url}&sample=<content|url>`
- `grammar-type={text|url}`: Whether to treat the `grammar` content as raw text or a URL to a file.
- `grammar=<content|url>`: The grammar content to use, either as text or a URL to fetch from, as determined by `grammar-type`
- `sample-type={text|url}`: Whether to treat the `sample` content as text or a URL to fetch from.
- `sample=<content|url>`: The sample content to highlight, either as text or a URL, as determined by `sample-type`.
