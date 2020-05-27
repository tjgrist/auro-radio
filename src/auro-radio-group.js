// Copyright (c) Alaska Air. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.
// ---------------------------------------------------------------------
import { LitElement, html } from "lit-element";
import { classMap } from 'lit-html/directives/class-map';

// Import touch detection lib
import 'focus-visible/dist/focus-visible.min.js';

// Import the processed CSS file into the scope of the component
import componentProperties from './tokens/componentShapeProperties-css.js';
import styleCss from "./ods-style-css.js";

class AuroRadioGroup extends LitElement {
  constructor() {
    super();

    this.index = 0;
  }

  static get properties() {
    return {
      disabled:   { type: Boolean },
      horizontal: { type: Boolean },
      error:      { type: String },
      label:      { type: String }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.items = Array.from(this.querySelectorAll('auro-radio'));
    this.initializeIndex();

    this.items.forEach((el) => {
      el.disabled = this.disabled
    });

    this.addEventListener('toggleSelected', this.handleToggleSelected);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('focusSelected', this.handleFocusSelected);
  }

  initializeIndex() {
    const index = this.items.findIndex((item) => item.checked);

    this.index = index < 0 ? 0 : index;
    if (this.items.length > 0) {
      this.items[this.index].tabIndex = 0;
    }
  }

  handleToggleSelected(event) {
    this.index = this.items.indexOf(event.target);
    this.items.forEach((item) => {
      if (item === event.target) {
        item.tabIndex = 0;
      } else {
        const sdInput = item.shadowRoot.querySelector('input');

        sdInput.checked = false;
        item.checked = false;
        item.tabIndex = -1;
      }
    })
  }

  errorChange() {
    this.items.forEach((el) => {
      el.error = Boolean(this.error)
    });
  }

  selectItem(index) {
    const sdItem = this.items[index].shadowRoot.querySelector('input');

    sdItem.click();
    sdItem.focus();
    this.index = index;
  }

  handleKeyDown(event) {
    switch (event.key) {
      case " ":
        event.preventDefault();
        this.selectItem(this.index);
        break;

      case "Down":
      case "ArrowDown":
      case "Right":
      case "ArrowRight":
        event.preventDefault();
        this.selectItem(this.index === this.items.length - 1 ? 0 : this.index + 1);
        break;

      case "Up":
      case "ArrowUp":
      case "Left":
      case "ArrowLeft":
        event.preventDefault();
        this.selectItem(this.index === 0 ? this.items.length - 1 : this.index - 1);
        break;
      default:
        break;
    }
  }

  handleFocusSelected() {
    const sdItem = this.items[this.index].shadowRoot.querySelector('input');

    sdItem.focus();
  }

  render() {
    const groupClasses = {
      'displayFlex': this.horizontal && this.items.length <= 3
    }

    return html`
      ${componentProperties}
      ${styleCss}

      ${this.errorChange()}

      <fieldset class="${classMap(groupClasses)}">
        ${this.label
          ? html`<legend>${this.label}</legend>`
          : html``
        }
        <slot></slot>
      </fieldset>

      ${this.error
        ? html`<p class="errorText">${this.error}</p>`
        : html``}
    `;
  }
}

/* istanbul ignore else */
// define the name of the custom component
if (!customElements.get("auro-radio-group")) {
  customElements.define("auro-radio-group", AuroRadioGroup);
}