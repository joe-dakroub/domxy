# Domxy
The `domxy` JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object is a simple and expressive way to create DOM and SVG elements in JavaScript without the need to learn a special syntax or use a build tool.

## Features
- Create DOM and SVG elements with ease
- Pure JavaScript, no JSX or special syntax
- Every element is simple a function call
- Optionally pass attributes, properties and `data-*` as an object
- Supports Custom Elements with PascalCased-names for easy identification
- No need for a build tool

## Usage

### JavaScript
```js
import { domxy } from "/domxy.js"
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.1/cdn/components/button/button.js"

const { div, form, input, label, SlButton } = domxy

const example = form({ dataset: { controller: "hello" } },
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

document.body.appendChild(example)
```

### Rendered DOM tree
```html
<form data-controller="hello">
  <div class="form-group">
    <label for="name">Name</label>
    <input data-hello-target="name" id="name" name="name" placeholder="enter a name" type="text">
  </div>
  <sl-button data-action="click->hello#greet">Submit</sl-button>
</form>
```

## Details
Notice that you must destructure the element names out of the `domxy` object:

```js
const { h1, p, textarea, SlCarousel, SwiperContainer, SwiperSlide } = domxy
```

*Per standard JavaScript practices, an error will be thrown if you try to access a function without it being declared first.*

Custom Elements can be created by their Pascal case name:

```js
form(
  SlInput({ variant: "danger" }),
  SlButton({ type: "submit" }, "Submit")
)
```

Custom `data-*` attributes can be assigned using the standard `dataset` property:

### JS
```js
div({ dataset: { size: "lg", type: "container" } })
```

### HTML
```html
<div data-size="lg" data-type="container"></div>
```

ARIA attributes can be set using Camel case names or the `aria` property:

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

### HTML
```html
<span
  aria-checked="false"
  aria-labelledby="tac"
  role="checkbox"
  tabindex="0"
></span>
<span id="tac">I agree to the Terms and Conditions.</span>

```

## More Examples

Render SVG with the same ease as DOM nodes:

```js
svg({ ariaHidden: true, class: "icon", viewBox: "0 0 20 20" },
  path({
    d: "M17,15.98059V17a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V15.98059a.9998.9998,0,0,1,.37531-.78082l2.556-2.0448A4.00431,4.00431,0,0,0,9.2998,15h1.4004a4.00431,4.00431,0,0,0,3.36853-1.845l2.556,2.0448A.9998.9998,0,0,1,17,15.98059ZM7.47211,11.81226A2,2,0,0,0,9.29974,13h1.40052a2,2,0,0,0,1.82763-1.18774L13.65527,9.2757A4.00024,4.00024,0,0,0,14,7.65112V6a3.97577,3.97577,0,0,0-4-4A4.1928,4.1928,0,0,0,6,6.17206V7.65112A4.00024,4.00024,0,0,0,6.34473,9.2757Z",
  })
);
```

Boolean properties are set using `true` or `false`:

```js
details({ open: true },
  summary("Details"),
  p({ contenteditable: true }, "Something small enough to escape casual notice.")
);
```

If used inside of a JavaScript class, you can take advantage of object properties to "define and assign" elements for later use with elegance:

```js
class HsCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(
      this.image = img(),
      this.title = h2(),
      p("Default copy ",
        this.link = a("Action link")
      ),
    );
  }

  update({ image, link, title }) {
    this.image.src = image;
    this.link.href = link;
    this.title = title;
  }
}
```