# HTML list lens — Visualize Your HTML List Hierarchy

**HTML list lens** is a lightweight Visual Studio Code extension that helps you visualize the nested structure of your HTML lists (`<ul>`, `<ol>`, `<li>`), by decorating each `<li>` tag with its hierarchical position — without modifying the actual content.


## 🚀 Features

✅ Visualize `<li>` nesting levels in real-time  
✅ Highlights both the start and end tags with hierarchy hints  
✅ Supports multi-line and inline `<li>` structures  
✅ Handles deeply nested `<ul>` / `<ol>` combinations  
✅ No intrusive changes — pure decorations only  
✅ Fully customizable language support via settings


## 💡 Use Case Example




## 🛠️ Supported Languages

Out of the box, `list-lens` supports:

- `html`
- `php`
- `twig`
- `handlebars`
- `javascript` / `typescript`
- `javascriptreact` / `typescriptreact`
- `vue`
- `svelte`

> You can extend or override this behavior via your VS Code settings.


## ⚙️ Configuration

You can override default behavior in your `settings.json`:

### `htmlListLens.includeLanguages`

Adds additional languages to be included.

```json
{
  "htmlListLens.includeLanguages": ["astro", "nunjucks"]
}
```

### `htmlListLens.excludeLanguages`

Explicitly removes languages from being parsed.

```json
{
  "htmlListLens.excludeLanguages": ["vue"]
}
```

### `htmlListLens.decorations`

```json
{
  "htmlListLens.decorations.lightColor": "#444444",
  "htmlListLens.decorations.darkColor": "#DDDDDD",
  "htmlListLens.decorations.lightBackground": "rgba(240, 240, 240, 0.5)",
  "htmlListLens.decorations.darkBackground": "rgba(20, 20, 20, 0.3)",
  "htmlListLens.decorations.fontStyle": "italic",
  "htmlListLens.decorations.fontWeight": "bold",
}
```

