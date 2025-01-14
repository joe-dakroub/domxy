# [domxy](https://domxy.js.org)
A lightweight library for effortlessly creating HTML and SVG elements in JavaScript.

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
- ✨ Create HTML and SVG elements expressively
- ☕ Pure JavaScript, no special syntax to learn
- 🤙 Every element is a function call
- 🪪 Optionally pass attributes and properties, including `data` and `aria`
- ⚡ Supports Custom Elements with Pascal-cased names
- 🚫 No need for a build tool
- 📦 Standard ES Module

## Overview
**domxy** is a [JavaScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object that generates HTML and SVG DOM elements using an HTML-like syntax in pure JavaScript.

You must [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the elements from the **domxy** object before using:

```js
const { div, form, input, label, SlButton } = domxy
```

**⚠️ An error will be thrown if you try to access an element function without it being declared first.**

Custom Element instances can be created using Pascal case naming:

```js
form(
  SlInput({ variant: "danger" }), // sl-input
  SlButton({ type: "submit" }, "Submit") // sl-button
)
```

[Data attributes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes) and [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) can be assigned using Camel case names or the `dataset` or `aria` property:

### JavaScript
```js
span({
  aria: { labelledby: "tac", },
  ariaChecked: true,
  dataset: { test: true },
  role: "checkbox",
  tabindex: 0
}),
span({ id: "tac" }, "I agree to the Terms and Conditions.")`)
```

### DOM
```html
<span aria-checked="false" aria-labelledby="tac" data-test="true" role="checkbox" tabindex="0"></span>
<span id="tac">I agree to the Terms and Conditions.</span>
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

**⚠️ DocumentFragments do not accept attributes or properties. A warning will be thrown when attempted.**

In addition to `String`, `Number` and `Boolean` types, attributes can accept `Date`, `Array` and `Object` types as values by calling [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) on them:


### JavaScript
```js
div({ dataModel: { type: "user", active: false } })
```

### DOM
```html
<div data-model="{"type":"user","active":false}"></div>
```

**⚠️ Property values do not get stringified. Not recommended for large sets of data.**

While not a **domxy** feature, if used inside of a JavaScript class, you can take advantage of inline property assignment to "define and assign" elements as references for later use:

```js
class HsCard extends BitElement {
  static properties = {
    copy: { type: String, required: true },
    image: { type: String },
    link: { type: URL },
    title: { type: String, required: true },
  }

  constructor() {
    super();
    this.shadowRoot.append(
      this.imageEl = img({ alt: "" }),
      this.titleEl = h2(),
      this.copyEl = p("Default copy ",
        this.linkEl = a("Card link")
      ),
    )
  }

  update() {
    this.copyEl.textContent = this.copy
    this.imageEl.src = this.image
    this.linkEl.href = this.link.href
    this.titleEl.textContent = this.title
  }
}
```

## Why?
Whether you need to or enjoy working with DOM elements directly in JavaScript, you know how verbose creating and forming them into even a modest tree can get.

**domxy** makes working with DOM nodes easy, expressive and powerful.

## Installation
Import **domxy** as an ES module:

```js
import { domxy } from "https://domxy.js.org/domxy.js"

const { h1, main } = domxy

document.body.append(
  main(
    h1("Hello, domxy.")
  )
)
```

## Downloads
- [domxy.js (3.6 KB)](https://domxy.js.org/domxy.js)
- [domxy.min.js (1.5 KB)](https://domxy.js.org/domxy.min.js)

## Tests
1. Run [tests.html](/tests.html) in a web browser
2. Open the Developer Tools and select the Console tab
3. **All tests passed!** or the error and line number will display in the console

## License
**domxy** was created by [Joe Dakroub](https://github.com/joe-dakroub) and is released under the [Unlicense](https://unlicense.org/).

## Changelog
Detailed changes for each release are documented in the [release notes]().

## Donations
If you find **domxy** useful, please consider [a small donation](https://www.paypal.com/donate/?business=4QSWBKHDKBNEN&no_recurring=0&item_name=Building+thoughtful+software+for+the+Web.&currency_code=USD).