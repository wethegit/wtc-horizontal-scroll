# wtc-horizontal-scroll

A customizable horizontal-scroll component.
Features:

- Custom scrollbars
- Optional scroll-snapping
- Out-of-the-box accessible UI (TODO)
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

The following options can ether be be passed into an object as a second argument to the constructor, or as data-attributes on the HTML itself. For example:

```js
new HorizontalScroll(element, { scrollSnap: true }
```

OR

```html
<div class="horizontal-scroll" data-scroll-snap="true">
  <!-- the rest of the markup -->
</div>
```

### `navigation`

Whether or not to use left/right buttons to advance the scrollbar position. For accessibility reasons, if your child items are not focusable (maybe they're just text and images), it's recommended to keep the default setting of `true` here. Otherwise, you're exluding users who do not use a mouse, trackpad, touch screen, or similar interface.  
Default: `true`

### `navigationLabel`

The `aria-label` attribute for the the `<nav>` landmark. Only applies if `navigation` is set to `true`. If you're using this component more than once on a page, make sure you give a unique label to each instance. Otherwise your page will not be WCAG compliant See [_Using ARIA landmarks to identify regions of a page_](https://www.w3.org/TR/WCAG20-TECHS/ARIA11.html).  
Default: `"Horizontal scroll"`

### `navigationTextLeft`

Hidden text to apply to the left/right navigation buttons, for use with assistive technology such as a screen-reader. Only applies if `navigation` is set to `true`.  
Default: `"Scroll backwards"`

### `navigationTextRight`

Hidden text to apply to the left/right navigation buttons, for use with assistive technology such as a screen-reader. Only applies if `navigation` is set to `true`.  
Default: `"Scroll forwards"`

### `scrollSnap`

Whether or not to use CSS scroll-snapping to auto-align each item when the user stops scrolling.  
Default: `false`

That's all for now, but please feel free to open a pull request or an issue on this repo and suggest more options.

---

## Custom styles

You can easily adjust the look of your component by overriding some pre-defined CSS custom properties:

### `--item-gap`

The space between the child items, in pixels.  
Default: `24px`

### `--item-width`

The width of the child items. If you have varying widths, set this property to `auto`.  
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

## Demos

TODO: make a list of three or four custom examples on CodePen
