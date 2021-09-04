import tween from "wtc-tween";

/**
 * Class to instantiate a Horizontal Scroll component. Includes optional
 * navigational element, and resize logic to determine layout behavior
 * (centering or scrolling) based on the width of the DOM element's parent.
 */
class HorizontalScroll {
  /**
   * Creates the HorizontalScroll instance.
   *
   * @param {HTMLElement} element - The DOM element to assign to our scroll
   * component.
   * @param {object} [options] - An object of optional settings.
   * @param {string} [options.baseClassName] - The DOM
   * element's className to look for. This defaults to "horizontal-scroll". If
   * you change this setting, please ensure that your markup and you CSS follow
   * the same naming convention, and specifically includes the correct
   * classNames as outlined within this class.
   * @param {boolean} [options.navigation] - Whether or not to use left/right
   * buttons to advance the scrollbar position.
   * @param {string} [options.navigationLabel] - The `aria-label` attribute for
   * the the `<nav>` landmark.
   * @param {string} [options.navigationHiddenTextPrev] - Hidden text to apply
   * to the "previous" navigation button.
   * @param {string} [options.navigationHiddenTextNext] - Hidden text to apply
   * to the "next" navigation button.
   * @param {string} [options.navigationVisualContentPrev] - A string of HTML
   * content for the "previous" navigation button's _visual_ content. Intended
   * to be hidden from assistive technology.
   * @param {string} [options.navigationVisualContentNext] - A string of HTML
   * content for the "next" navigation button's _visual_ content. Intended to be
   * hidden from assistive technology.
   * @param {number} [options.scrollIncrement] - The amount of child items to
   * advance when using the next/previous navigation buttons.
   * @param {boolean} [options.scrollSnap] - Whether or not to use CSS
   * scroll-snapping to auto-align each item when the user stops scrolling.
   * Cannot be used with `navigation: true`, due to conflicting animations.
   */
  constructor(element, options = {}) {
    this.element = element;

    // Grab the data-attributes
    const {
      baseClassName,
      navigation,
      navigationLabel,
      navigationHiddenTextPrev,
      navigationHiddenTextNext,
      scrollIncrement,
      scrollSnap,
    } = this.element.dataset;

    // Set options based on the data-attributes (where applicable).
    // Anything passed to the constructor will take priority.
    this.options = {
      baseClassName: baseClassName || "horizontal-scroll",
      // Ease curve defaults to a quadratic in-out:
      easingFunction: (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
      // Navigation defaults to true, unless "false" data-attr is passed:
      navigation: navigation && navigation === "false" ? false : true,
      // Nav aria label:
      navigationLabel: navigationLabel || "Horizontal scroll",
      // Next button hidden text:
      navigationHiddenTextNext: navigationHiddenTextNext || "Scroll forwards",
      // Next button previous text:
      navigationHiddenTextPrev: navigationHiddenTextPrev || "Scroll backwards",
      // Next and previous buttons' _visual_ contents default to visually-hidden
      // greater-than and less-than signs. You can, however, add as much HTML
      // content as you like to a wrapper with a classname of
      // ".horizontal-scroll__nav-markup-next"—if this element exists, it will
      // be used instead. useful for complex button markup:
      navigationVisualContentNext: this.element.querySelector(
        ".horizontal-scroll__nav-markup-next"
      )
        ? this.element.querySelector(".horizontal-scroll__nav-markup-next")
            .innerHTML
        : "<span aria-hidden-'true'>></span>",
      navigationVisualContentPrev: this.element.querySelector(
        ".horizontal-scroll__nav-markup-previous"
      )
        ? this.element.querySelector(".horizontal-scroll__nav-markup-previous")
            .innerHTML
        : "<span aria-hidden-'true'><</span>",
      // Scroll increment defaults to 1, unless some other data-attr is passed:
      scrollIncrement: (scrollIncrement && parseInt(scrollIncrement)) || 1,
      // Scroll-snap defaults to false, unless "true" data-attr is passed:
      scrollSnap: scrollSnap === "true" || false,
      ...options,
    };

    this.list = element.querySelector(`.${this.options.baseClassName}__list`);
    this.items = [
      ...element.querySelectorAll(`.${this.options.baseClassName}__item`),
    ];
    // get information from the CSS custom properties:
    this.computedStyle = window.getComputedStyle(this.element);
    this.itemGap = parseInt(
      this.computedStyle.getPropertyValue("--item-gap").replace("px", "")
    );
    this.listPad = parseInt(
      this.computedStyle.getPropertyValue("--list-pad").replace("px", "")
    );

    this.handleResize = this.handleResize.bind(this);
    this.itemReducer = this.itemReducer.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);

    // debounce timer:
    this.resizeTimer = null;

    // ----------------------
    // Initialization:
    // ----------------------
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("load", () => this.adjustAlignment());

    // add scroll snap modifier class if needed
    this.options.scrollSnap &&
      this.element.classList.add(`${this.options.baseClassName}--snap`);

    // generate the navigation markup!
    if (this.options.navigation) {
      const nav = document.createElement("nav");
      const navPrev = document.createElement("button");
      const navNext = document.createElement("button");
      const navPrevHiddenText = document.createElement("span");
      const navNextHiddenText = document.createElement("span");
      // The following two div wrappers are created so that users can animate
      // the buttons themselves if they want to, and any "translate" positioning
      // won't get in the way of that:
      const navWrapperPrev = document.createElement("div");
      const navWrapperNext = document.createElement("div");

      // Component navigation aria-label:
      this.options.navigationLabel &&
        nav.setAttribute("aria-label", this.options.navigationLabel);

      // Add classNames:
      nav.classList.add(`${this.options.baseClassName}__nav`);
      navWrapperPrev.classList.add(
        `${this.options.baseClassName}__nav-item`,
        `${this.options.baseClassName}__nav-item--prev`
      );
      navWrapperNext.classList.add(
        `${this.options.baseClassName}__nav-item`,
        `${this.options.baseClassName}__nav-item--next`
      );
      navPrev.classList.add(
        `${this.options.baseClassName}__nav-button`,
        `${this.options.baseClassName}__nav-button--prev`
      );
      navNext.classList.add(
        `${this.options.baseClassName}__nav-button`,
        `${this.options.baseClassName}__nav-button--next`
      );
      navPrevHiddenText.classList.add(
        `${this.options.baseClassName}__visually-hidden`
      );
      navNextHiddenText.classList.add(
        `${this.options.baseClassName}__visually-hidden`
      );

      // Add direction attributes to nav buttons (prev/next ==> 0/1):
      navPrev.dataset.dir = "0";
      navNext.dataset.dir = "1";

      // Assemble the navigation content:
      navPrevHiddenText.textContent = this.options.navigationHiddenTextPrev;
      navNextHiddenText.textContent = this.options.navigationHiddenTextNext;
      // add the visual button content:
      navPrev.innerHTML = this.options.navigationVisualContentPrev;
      navNext.innerHTML = this.options.navigationVisualContentNext;
      // add the hidden text content:
      navNext.appendChild(navNextHiddenText);
      navPrev.appendChild(navPrevHiddenText);
      // assemble it all and append to the DOM:
      navWrapperPrev.appendChild(navPrev);
      navWrapperNext.appendChild(navNext);
      nav.appendChild(navWrapperPrev);
      nav.appendChild(navWrapperNext);
      this.element.insertAdjacentElement("afterbegin", nav);

      // Hook up click events:
      navPrev.addEventListener("click", this.handleNavClick);
      navNext.addEventListener("click", this.handleNavClick);
    }
  }

  /**
   * Calculates the total pixel-width of the component's children (items),
   * including their margins (gap) and the list's padding.
   *
   * @param {number} total - The reducer's accumulator value.
   * @param {HTMLElement} currentItem - The reducer's current value.
   * @param {number} i - The index of the current item.
   * @returns The total width of the component's children.
   */
  itemReducer(total, currentItem, i) {
    const width = currentItem.offsetWidth;
    // This next line is a sort of shorthand. At some point in this reducer,
    // we will need the "--list-pad" value, so we're just getting it from
    // the 0th element. We'll pull the "--item-gap" value from the rest.
    const gap = i === 0 ? this.listPad : this.itemGap;
    return total + width + gap;
  }

  /**
   * Determines whether to center the items within in the component's parent
   * container, or add a horizontal scrollbar due to overflow. This behavior
   * is toggled via a CSS className of "<this.baseClassName>--center-items".
   */
  adjustAlignment() {
    const itemsWidth = this.items.reduce(this.itemReducer, 0);
    const listWidth = this.element.offsetWidth;
    this.element.classList[itemsWidth > listWidth ? "remove" : "add"](
      `${this.options.baseClassName}--center-items`
    );
  }

  /**
   * Calculates a new scroll position based on the current scroll position and
   * the "scrollIncrement" option.
   *
   * @param {number | boolean} direction - true/false (or 1/0) maps to
   * next/previous, and determines the direction of the scroll.
   * @returns {number} The new scroll position
   */
  calculateNewScrollPosition(direction = 1) {
    const itemWidth = this.items[0].offsetWidth;

    // Get the x value for the leftmost item that is _fully_ visible
    const leftmostItem = this.items.find(
      (x) => x.getBoundingClientRect().x >= this.itemGap * 0.5
    );
    const leftmostItemX = leftmostItem.getBoundingClientRect().x;

    // The following bunch of calculations basically determines:
    // Do we honor the "scrollIncrement" value, or will that skip over content?
    // If it will skip over content, we ensure that the scrollIncrement is
    // one "item width" less than what was passed in as the option.

    const leftPad =
      leftmostItem === this.items[0] ? this.listPad : this.itemGap * 0.5;

    // TODO: if you pass null as the increment, update scroll pos based on
    // number of visible items.
    const scrollIncrement = this.options.scrollIncrement;

    let incrementMultiplier =
      leftmostItemX === leftPad ? scrollIncrement : scrollIncrement - 1;

    let newScrollPosition;

    if (direction) {
      // "next"
      newScrollPosition =
        this.list.scrollLeft +
        leftmostItemX +
        incrementMultiplier * (itemWidth + this.itemGap) -
        this.itemGap * 0.5;
    } else {
      // "previous"
      if (
        this.list.scrollLeft <=
        itemWidth + this.listPad + this.itemGap * 0.5
      ) {
        // Since the listPad and itemGap will be different, this check will
        // save us some calculation work by just checking whether we should go
        // back to the very beginning…
        newScrollPosition = 0;
      } else {
        // …In all other cases though, we'll need to use a similar logic to the
        // next button, but slightly tweaked:
        newScrollPosition =
          incrementMultiplier < 1
            ? this.list.scrollLeft -
              (itemWidth + this.itemGap - leftmostItemX + leftPad) -
              incrementMultiplier * (itemWidth + this.itemGap)
            : this.list.scrollLeft -
              incrementMultiplier * (itemWidth + this.itemGap);
      }
    }

    return newScrollPosition;
  }

  /**
   * Tweens the scroll position to the necessary value. This fires on nav click,
   * but can also be called programatically if needed.
   *
   * @param {number | boolean} direction - true/false (or 1/0) maps to
   * next/previous, and determines the direction of the scroll.
   */
  updateScrollPosition(direction = 1) {
    const initialPos = this.list.scrollLeft;
    const newPos = this.calculateNewScrollPosition(direction);
    const prefersReducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = prefersReducedMotion ? 1 : 400;

    tween(initialPos, newPos, (value) => this.list.scroll(value, 0), {
      duration,
      timingFunction: this.options.easingFunction,
    });
  }

  /**
   *
   * @param {Event} e - A click event. Expects to be fired from a nav button.
   */
  handleNavClick(e) {
    const { dir: direction } = e.currentTarget.dataset;
    this.updateScrollPosition(parseInt(direction));
  }

  /**
   * A "debounced" function that is called on window resize. This is used to
   * determine whether to center the items in the component, or add a scrollbar
   * due to overflow.
   * @param {Event} e - A window resize event
   */
  handleResize(e) {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.itemGap = parseInt(
        this.computedStyle.getPropertyValue("--item-gap").replace("px", "")
      );
      this.listPad = parseInt(
        this.computedStyle.getPropertyValue("--list-pad").replace("px", "")
      );
      this.adjustAlignment();
    }, 250);
  }
}

export default HorizontalScroll;
