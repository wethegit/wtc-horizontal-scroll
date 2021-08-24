# wtc-horizontal-scroll

A customizable horizontal-scroll component.
Features:

- Custom scrollbars
- Optional scroll-snapping
- Out-of-the-box accessible UI
- Automatically centers content when a scrollbar is not needed

## Usage

### Installation

Install the package with npm or yarn:

```sh
npm install wtc-horizontal-scroll
```

```sh
yarn add wtc-horizontal-scroll
```

Import the component into your JavaScript file:

```js
import HorizontalScroll from "wtc-horizontal-scroll";
```

Import the CSS into your stylesheet, or copy the stylesheet from `/node_modules/wtc-horizontal-scroll/wtc-horizontal-scroll.css` into your project.

```scss
@import "~wtc-horizontal-scroll/wtc-horizontal-scroll.css";
```

### Quick start

To get this up and running, you just need a the following HTML structure, and some quick JavaScript to instantiate it.

```html
<div class="horizontal-scroll">
  <ul class="horizontal-scroll__list">
    <li class="horizontal-scroll__item">Item 1</li>
    <li class="horizontal-scroll__item">Item 2</li>
    <li class="horizontal-scroll__item">Item 3</li>
    <!-- ...etc -->
  </ul>
</div>
```

```js
import HorizontalScroll from "wtc-horizontal-scroll";

const scrollElement = document.querySelector(".horizontal-scroll");
new HorizontalScroll(scrollElement);
```

---

## Options

Most of the following options can ether be be passed into an object as a second argument to the constructor, or as data-attributes on the HTML itself. For example:

```js
new HorizontalScroll(element, { scrollSnap: true }
```

OR

```html
<div class="horizontal-scroll" data-scroll-snap="true">
  <!-- the rest of the markup -->
</div>
```

### `baseClassName`

This allows you to customize the "block" className (see the [BEM naming methodology](http://getbem.com/introduction/)). Please note that you will have to update all stylesheet selectors as well, if you change this. It's recommended to leave it as is.  
Default: `horizontal-scroll`

### `easingFunction`

Type: Function  
Default:

```js
(x) => {
  if (x < 0.5) 2 * x * x;
  else 1 - Math.pow(-2 * x + 2, 2) / 2;
};
```

Sets the easing curve for the scroll animation when navigation buttons are used. Defaults to a quadratic ease-in-out. This option can only be modified via the constructor function (not a data attribute).

### `navigation`

Type: Boolean  
Default: `true`  
Whether or not to use left/right buttons to advance the scrollbar position. For accessibility reasons, if your child items are not focusable (maybe they're just text and images), it's recommended to keep the default setting of `true` here. Otherwise, you're exluding users who do not use a mouse, trackpad, touch screen, or similar interface.

### `navigationLabel`

Type: String  
Default: `"Horizontal scroll"`  
The `aria-label` attribute for the the `<nav>` landmark. If you're using this component more than once on a page, make sure you give a unique label to each instance. Otherwise your page will not be WCAG compliant See [_Using ARIA landmarks to identify regions of a page_](https://www.w3.org/TR/WCAG20-TECHS/ARIA11.html).

### `navigationHiddenTextPrev`

Type: String  
Default: `"Scroll backwards"`  
Hidden text to apply to the "previous" navigation button, for use with assistive technology such as a screen-reader.

### `navigationHiddenTextNext`

Type: String  
Default: `"Scroll forwards"`  
Hidden text to apply to the "next" navigation button, for use with assistive technology such as a screen-reader.

### `navigationVisualContentPrev`

type: String  
Default: `"<span aria-hidden="true"> < </span>"`  
A string of HTML content for the "previous" navigation button. The default value contains the `aria-hidden="true"` attribute, meaning it will not be announced by assistive technology.

### `navigationVisualContentNext`

type: String  
Default: `"<span aria-hidden="true"> > </span>"`  
A string of HTML content for the "next" navigation button. The default value contains the `aria-hidden="true"` attribute, meaning it will not be announced by assistive technology. Use in conjunction with `navigationHiddenText<Next|Prev>`.

### `scrollSnap`

Type: Boolean  
Default: `false`  
Whether or not to use CSS scroll-snapping to auto-align each item when the user stops scrolling.  
⚠️ Currently this can only be used with `navigation` set to `false`, as the tweening of the scroll position interferes with the CSS scroll-snap.

---

## Custom styles

You can easily adjust the look of your component by overriding some pre-defined CSS custom properties:

### `--item-gap`

The space between the child items, in pixels.  
Default: `24px`

### `--item-width`

The width of the child items. Currently this component only supports a uniform width for all child items, due to a desire to keep this thing svelte (items of varying widths would require a bit of unnecessary overhead when calculating the scroll increment value for the nav arrow advancing). Support for varied widths may be added in a future update, depending on the demand for it.
Default: `300px`

### `--list-pad`

The left/right padding of the component, in pixels. On Webkit browsers, this also influences the visual "inset" of the scrollbar.  
Default: `16px`

### `--scrollbar-height`

The height of the custom scrollbar. Please be aware that this only affects Webkit browsers.  
Default: `6px`

### `--scrollbar-thumb-color`

The color of the scrollbar thumb. Accepts any CSS color value.  
Default: `magenta`

### `--scrollbar-track-color`

The color of the scrollbar track. Accepts any CSS color value.  
Default: `#cccccc`

---

## Examples

🛠 TODO: make a list of three or four custom examples on CodePen

For testing purposes, you can check this out for now: https://codepen.io/andyranged/pen/3fa2c8b9e92f87ecb9703bbb9693ed53
