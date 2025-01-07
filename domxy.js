/**
 * Checks if a tag is a valid HTML tag.
 * @param {string} tag - The tag to check.
 * @returns {boolean} - True if the tag is valid, false otherwise.
 */
const isValidHtmlTag = (tag) => {
  return document.createElement(tag).toString() !==
    "[object HTMLUnknownElement]";
};

/**
 * Checks if a tag is a valid SVG tag.
 * @param {string} tag - The tag to check.
 * @returns {boolean} - True if the tag is valid, false otherwise.
 */
const isValidSvgTag = (tag) => {
  return document.createElementNS("http://www.w3.org/2000/svg", tag)
    .toString() !== "[object SVGElement]";
};

/**
 * Converts a string to kebab-case.
 * @param {string} name - The string to convert.
 * @returns {string} - The kebab-case string.
 */
const toKebabCase = (name) => {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

/**
 * Proxy handler for creating DOM/SVG elements.
 */
export const domxy = new Proxy({}, {
  get: (_, tag) => {
    // Convert PascalCase to kebab-case
    const kebabTag = /^[A-Z]/.test(tag) ? toKebabCase(tag) : tag;

    return (...args) => {
      const isSvg = kebabTag === "svg" || isValidSvgTag(kebabTag);
      const attributes = {};
      const properties = {};
      let children = [];

      // Extract attributes and properties if the first argument is an object
      if (
        args.length > 0 && typeof args[0] === "object" &&
        !Array.isArray(args[0]) && !(args[0] instanceof Node)
      ) {
        const attrsAndProps = args.shift();
        for (const [key, value] of Object.entries(attrsAndProps)) {
          if (key === "dataset") {
            for (const [dataKey, dataValue] of Object.entries(value)) {
              attributes[`data-${toKebabCase(dataKey)}`] = dataValue;
            }
          } else if (key in document.createElement("div")) {
            properties[key] = value;
          } else {
            attributes[key] = value;
          }
        }
      }
      children = args;

      // Check if the tag is a valid HTML element, a valid SVG element, or a defined custom element
      if (!isValidHtmlTag(kebabTag) && !isValidSvgTag(kebabTag) && !customElements.get(kebabTag)) {
        throw new Error(`Element "${kebabTag}" is not a valid HTML element, SVG element, or a defined custom element.`);
      }

      // Create the element
      const element = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", kebabTag) : document.createElement(kebabTag);

      // Add xmlns attribute for SVG elements
      if (isSvg && !attributes.xmlns) {
        element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }

      // Add attributes
      for (const [key, value] of Object.entries(attributes)) {
        if (isSvg) {
          element.setAttributeNS(null, key, value);
        } else {
          element.setAttribute(key, value);
        }
      }

      // Add properties
      for (const [key, value] of Object.entries(properties)) {
        element[key] = value;
      }

      // Append children
      for (const child of children) {
        if (typeof child === "string" || typeof child === "number") {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          element.appendChild(child);
        }
      }

      return element;
    };
  }
});