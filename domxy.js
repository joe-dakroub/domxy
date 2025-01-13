/**
 * domxy - https://domxy.js.org
 * A simple, lightweight, and modern way to create DOM/SVG elements.
 * @author Joe Dakroub <joe.dakroub@me.com>
 */

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
 * Proxy handler for creating HTML, SVG and DocumentFragments.
 */
export const domxy = new Proxy({}, {
  get: (_, tag) => {
    const kebabTag = /^[A-Z]/.test(tag) ? toKebabCase(tag) : tag;

    return (...args) => {
      const isSvg = kebabTag === "svg" || (kebabTag !== "a" && isValidSvgTag(kebabTag));
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
          } else if (key === "aria") {
            for (const [ariaKey, ariaValue] of Object.entries(value)) {
              attributes[`aria-${toKebabCase(ariaKey)}`] = ariaValue;
            }
          } else if (key === "viewBox") {
            attributes[key] = value; // Keep viewBox camelCased
          } else if (key in document.createElement("div")) {
            properties[key] = value;
          } else {
            attributes[toKebabCase(key)] = value;
          }
        }
      }

      children = args;

      // Create the element or fragment
      let element;
      if (kebabTag === 'fragment') {
        element = document.createDocumentFragment();
        if (Object.keys(attributes).length > 0 || Object.keys(properties).length > 0) {
          console.warn('Warning: Fragments do not support attributes or properties.');
        }
      } else {
        element = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", kebabTag) : document.createElement(kebabTag);
      }

      // Set attributes if not a fragment
      if (kebabTag !== 'fragment') {
        for (const [key, value] of Object.entries(attributes)) {
          if (key === 'dataset') {
            for (const [dataKey, dataValue] of Object.entries(value)) {
              element.dataset[dataKey] = JSON.stringify(dataValue);
            }
          } else if (typeof value === 'object') {
            element.setAttribute(key, JSON.stringify(value));
          } else {
            element.setAttribute(key, value);
          }
        }

        // Set properties
        for (const [key, value] of Object.entries(properties)) {
          element[key] = value;
        }
      }

      // Append children
      for (const child of children) {
        if (Array.isArray(child)) {
          element.append(...child);
        } else if (typeof child === 'string') {
          element.insertAdjacentHTML("beforeend", child);
        } else {
          element.append(child);
        }
      }

      return element;
    };
  }
});