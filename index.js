/**
 * Class to instantiate a Horizontal Scroll component. Includes resize logic
 * to determine layout behavior (centering or scrolling) based on the width of
 * the DOM element's parent.
 */
class HorizontalScroll {
  /**
   * Creates the HorizontalScroll instance.
   *
   * @param {HTMLElement} element - The DOM element to assign to our scroll component.
   * @param {Object} [options] - An object of optional settings.
   * @param {String} [options.baseClassName] - The DOM element's className to look for.
   * This defaults to "horizontal-scroll", and should rarely be tampered with. This component
   * uses the BEM naming methodology, so if you do change this setting, please ensure that
   * your markup follows the same convention, and specifically includes the correct classNames
   * as outlined within this constructor function.
   */
  constructor(element, options = {}) {
    this.element = element;

    // Grab the data-attributes
    const {
      baseClassName,
      navigation,
      navigationLabel,
      navigationTextLeft,
      navigationTextRight,
      scrollSnap,
    } = this.element.dataset;

    // Set options based on the data-attributes.
    // Anything passed to the constructor will take priority.
    this.options = {
      baseClassName: baseClassName || "horizontal-scroll",
      navigation: navigation && navigation === "false" ? false : true,
      navigationLabel: navigationLabel || "Horizontal scroll",
      navigationTextLeft: navigationTextLeft || "Scroll backwards",
      navigationTextRight: navigationTextRight || "Scroll forwards",
      scrollSnap: scrollSnap === "true" || false,
      ...options,
    };

    this.list = element.querySelector(`.${this.options.baseClassName}__list`);
    this.items = [
      ...element.querySelectorAll(`.${this.options.baseClassName}__item`),
    ];
    this.computedStyle = window.getComputedStyle(this.element);
    this.itemGap = parseInt(
      this.computedStyle.getPropertyValue("--item-gap").replace("px", "")
    );
    this.listPad = parseInt(
      this.computedStyle.getPropertyValue("--list-pad").replace("px", "")
    );
    this.handleResize = this.handleResize.bind(this);
    this.itemReducer = this.itemReducer.bind(this);
    this.resizeTimer = null;

    // Initialization:

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("load", () => this.adjustAlignment());

    this.options.scrollSnap &&
      this.element.classList.add(`${this.options.baseClassName}--snap`);

    if (this.options.navigation) {
      const nav = document.createElement("nav");
      const navLeft = document.createElement("button");
      const navRight = document.createElement("button");
      // creating two div wrappers so that users can animate the buttons
      // themselves if they want to, and positioning won't get in the way:
      const navWrapperLeft = document.createElement("div");
      const navWrapperRight = document.createElement("div");

      this.options.navigationLabel &&
        nav.setAttribute("aria-label", this.options.navigationLabel);
      nav.classList.add(`${this.options.baseClassName}__nav`);
      navWrapperLeft.classList.add(
        `${this.options.baseClassName}__nav-item`,
        `${this.options.baseClassName}__nav-item--left`
      );
      navWrapperRight.classList.add(
        `${this.options.baseClassName}__nav-item`,
        `${this.options.baseClassName}__nav-item--right`
      );
      navLeft.classList.add(
        `${this.baseClassName}__nav-button`,
        `${this.baseClassName}__nav-button--left`
      );
      navRight.classList.add(
        `${this.baseClassName}__nav-button`,
        `${this.baseClassName}__nav-button--right`
      );
      navLeft.textContent = this.options.navigationTextLeft;
      navRight.textContent = this.options.navigationTextRight;

      navWrapperLeft.appendChild(navLeft);
      navWrapperRight.appendChild(navRight);
      nav.appendChild(navWrapperLeft);
      nav.appendChild(navWrapperRight);
      this.element.insertAdjacentElement("afterbegin", nav);
    }
  }

  /**
   * Calculates the total pixel-width of the component's children (items),
   * including their margins (gap) and the list's padding.
   *
   * @param {Number} total - The reducer's accumulator value.
   * @param {HTMLElement} currentItem - The reducer's current value.
   * @param {Number} i - The index of the current item.
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
