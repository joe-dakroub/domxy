# DOMXY

[domxy](https://domxy.js.org) is a tiny library that makes creating HTML and SVG elements in JavaScript expressive and enjoyable without the need for a build tool.

## Example

### JavaScript
```js
// Shoelace SlButton component
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.1/cdn/components/button/button.js"

// Domxy library
import { domxy } from "https://domxy.js.org/domxy.js"

// Destructure elements you want to use (including Custom Elements)
const { div, form, input, label, SlButton } = domxy

// Example form
const nameForm = form({ dataController: "hello" } },
  div({ class: "form-group" },
    label({ for: "name" }, "Name"),
    input({
      dataset: {
        helloTarget: "name"
      },
      id: "name",
      name: "name",
      placeholder: "enter a name",
      type: "text"
    }),
  ),
  SlButton({ dataset: { action: "click->hello#greet" } }, "Submit"),
)

// Append to the DOM
document.body.append(nameForm)
```

### DOM
```html
<form data-controller="hello">
  <div class="form-group">
    <label for="name">Name</label>
    <input data-hello-target="name" id="name" name="name" placeholder="enter a name" type="text">
  </div>
  <sl-button data-action="click->hello#greet">Submit</sl-button>
</form>
```

## Features
- ✅ Create HTML and SVG elements expressively and natively
- ☕ Pure JavaScript, no special syntax to learn
- 📟 Every element is simple a function call
- 🪪 Optionally pass attributes, properties and `data-*` as an object
- ⚡ Supports Custom Elements with Pascal-cased names for easy identification
- 🚫 No need for a build tool

## Why?
Whether you need to or enjoy working with DOM elements directly in JavaScript, you know how verbose creating and forming them into even a modest tree can get.

`domxy` makes working with DOM nodes as easy and enjoyable as other alternative syntaxes that require build tools, but requires little time to learn and very little overhead to run.

## Details
`domxy` is a tiny [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object that generates DOM elements based on the name of the function being called.

You must destructure the element names you want to use out of the `domxy` object before using:

```js
const { div, form, input, label, SlButton } = domxy
```

It is usually easiest to markup the DOM tree first using whatever element functions you need, and then come back and destructure the used elements after. [Copilot](https://copilot.microsoft.com) can help with this.

**🚨 An error will be thrown if you try to access an element function without it being declared first 🚨**

Custom Element instances can be created using Pascal case:

```js
form(
  SlInput({ variant: "danger" }), // sl-input
  SlButton({ type: "submit" }, "Submit") // sl-button
)
```

[Data attributes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes) can be assigned using Camel case names or the `dataset` property:

### JavaScript
```js
div({ dataColor: "tomato", dataset: { size: "lg", type: "container" } })
```

### DOM
```html
<div data-color="tomato" data-size="lg" data-type="container"></div>
```

Boolean properties are set using `true` or `false`:

```js
details({ open: true },
  summary("Details"),
  p({ contenteditable: true }, "Something small enough to escape casual notice.")
);
```

[ARIA attributes](https://www.w3.org/TR/using-aria/) can be assigned using Camel case names or the `aria` property:

### JavaScript
```js
span({
  aria: {
    labelledby: "tac",
  },
  ariaChecked: true,
  role: "checkbox",
  tabindex: 0
}),
span({ id: "tac" }, "I agree to the Terms and Conditions.")
```

### DOM
```html
<span
  aria-checked="false"
  aria-labelledby="tac"
  role="checkbox"
  tabindex="0"
></span>
<span id="tac">I agree to the Terms and Conditions.</span>

```

Create SVG elements just like any other HTML element:

```js
button({ type: "button" },
  svg({ ariaHidden: true, class: "icon", viewBox: "0 0 20 20" },
    path({
      d: "M17,15.98059V17a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V15.98059a.9998.9998,0,0,1,.37531-.78082l2.556-2.0448A4.00431,4.00431,0,0,0,9.2998,15h1.4004a4.00431,4.00431,0,0,0,3.36853-1.845l2.556,2.0448A.9998.9998,0,0,1,17,15.98059ZM7.47211,11.81226A2,2,0,0,0,9.29974,13h1.40052a2,2,0,0,0,1.82763-1.18774L13.65527,9.2757A4.00024,4.00024,0,0,0,14,7.65112V6a3.97577,3.97577,0,0,0-4-4A4.1928,4.1928,0,0,0,6,6.17206V7.65112A4.00024,4.00024,0,0,0,6.34473,9.2757Z",
    })
  ),
  "Acccount"
)
```

Create a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) using the `fragment` function:

### JavaScript
```js
fragment(
  h1("Title"),
  p("Intro paragraph.")
)
```

### DOM
```html
#document-fragment
<h1>Title</h1>
<p>Intro paragraph.</p>
```

**⚠️ DocumentFragments do not accept attributes or properties. A warning will be thrown when attempted. ⚠️**

In addition to `String`, `Number` and `Boolean` types, attributes can accept `Date`, `Array` and `Object` types as values by calling `JSON.stringify` on them:


### JavaScript
```js
div({ dataModel: { type: "user", active: false } })
```

### DOM
```html
<div data-model="{"type":"user","active":false}"></div>
```

**ℹ️ Property values do not get stringified. Not recommended for large sets of data. ℹ️**

While not a `domxy` feature, if used inside of a JavaScript class, you can take advantage of inline object property assignment to "define and assign" elements as references for later use:

```js
class HsCard extends BitElement {
  static properties = {
    "copy": { type: String, required: true },
    "image": { type: String },
    "link": { type: URL },
    "title": { type: String, required: true },
  }

  constructor() {
    super();
    this.shadowRoot.append(
      this.$image = img({ alt: "" }),
      this.$title = h2(),
      this.$copy = p("Default copy ",
        this.$link = a("Card link")
      ),
    );
  }

  update() {
    this.$copy.textContent = this.copy;
    this.$image.src = this.image;
    this.$link.href = this.link.href;
    this.$title.textContent = this.title;
  }
}
```

## Tests
1. Run `index.html` in a web browser
2. Open the Developer Tools and select the Console tab
3. If all tests passed, you should see `All tests passed!` or the error and line number in the console

## License
`domxy` is released under [The Unlicense](https://unlicense.org/).

## Changelog
Detailed changes for each release are documented in the [release notes]().

## Sponsorship
If you find `domxy` useful, please consider [becoming a sponsor]().