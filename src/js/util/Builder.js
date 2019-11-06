'use strict';

import Dropdown from './Dropdown';
import {isObjectEmpty} from './helpers/object';
import env from '../../../env';
import {strToNumber, capitalize} from './helpers/string';
import {numToCurrency} from './helpers/number';

export default class Builder {
	constructor(params) {
		const defaultParams = {
			target: 'atcBuilder', // The data-builder-target attribute of the wrapper element
			title: '',
			caption: '',
			colors: {},
			dropdowns: [],
		};

		this.params = {...defaultParams, ...params};
		this.dropdowns = [];
		this.elements = {};

		return (async () => {
			return await this._init();
		})();
	}

	_renderColorPicker() {
		if (this.params.colors && !isObjectEmpty(this.params.colors)) {
			const COLOR_PICKER_WRAPPER = document.createElement('div');

			this.params.colors.forEach((color) => {
				const COLOR_WRAPPER = document.createElement('a');
				COLOR_WRAPPER.href = '#';
				COLOR_WRAPPER.innerText = color.name;
				COLOR_WRAPPER.style.color = color.hex;

				COLOR_PICKER_WRAPPER.append(COLOR_WRAPPER);

				const COLOR_EVENT = new CustomEvent('builder.color.change', {
					detail: {color: color.name},
				});

				COLOR_WRAPPER.addEventListener('click', (event) => {
					event.preventDefault();
					this.elements.wrapper.dispatchEvent(COLOR_EVENT);

					this.dropdowns.forEach((dropdown) => {
						dropdown.elements.select.dispatchEvent(COLOR_EVENT);
					});
				});
			});

			this.elements.wrapper.prepend(COLOR_PICKER_WRAPPER);
		}

		return this;
	}

	async _renderDropdowns() {
		const BUILD_DROPDOWNS = new Promise((resolve, reject) => {
			this.params.dropdowns.forEach(async (dropdown) => {
				const DROPDOWN = await new Dropdown({
					...dropdown,
					builder: this,
				});
				this.dropdowns.push(DROPDOWN);
				this.elements.wrapper.append(DROPDOWN.html);

				if (this.dropdowns.length === this.params.dropdowns.length)
					resolve();
			});
		});

		BUILD_DROPDOWNS.then(() => {
			this._renderPrice();
		});

		return this;
	}

	_renderPrice() {
		const DROPDOWN_PRICES = [];

		this.dropdowns.forEach((dropdown) => {
			const DROPDOWN_PRICE = strToNumber(dropdown.activeOption.price);
			DROPDOWN_PRICES.push(DROPDOWN_PRICE);
		});

		const TOTAL_PRICE = DROPDOWN_PRICES.reduce((a, b) => a + b, 0);

		this.elements.wrapper.querySelector(
			`.${env.clientPrefix}-builder-price`
		).innerText = numToCurrency(TOTAL_PRICE);
	}

	_renderTitle(color = false) {
		const ACTIVE_COLOR = color
			? color
			: this.params.colors.reduce(
					(color) => color.active && color.name
			  );

		const TITLE = document.createElement('h4');
		TITLE.classList.add(`${env.clientPrefix}-builder-title`);

		let titleText = this.params.title;
		titleText = titleText.replace('{{COLOR}}', capitalize(ACTIVE_COLOR));

		TITLE.innerText = titleText;

		return TITLE;
	}

	async _events() {
		const TARGET = this.elements.wrapper;

		TARGET.addEventListener('builder.color.change', (event) => {
			const ACTIVE_COLOR = TARGET.getAttribute('data-active-color');

			if (ACTIVE_COLOR !== event.detail.color) {
				TARGET.setAttribute('data-active-color', event.detail.color);

				// update title
				this.elements.wrapper
					.querySelector(`.${env.clientPrefix}-builder-title`)
					.replaceWith(this._renderTitle(event.detail.color));
			}
		});

		TARGET.addEventListener('dropdown.option.change', (event) => {
			this._renderPrice();
		});
	}

	async _render() {
		const TARGET = document.querySelector(
			`[data-builder-target="${this.params.target}"]`
		);

		this.elements.wrapper = TARGET;

		if (!TARGET.classList.contains(`${env.clientPrefix}-builder-container`))
			TARGET.classList.add(`${env.clientPrefix}-builder-container`);

		const BUILDER_TITLE = this._renderTitle();

		const BUILDER_PRICE = document.createElement('h6');
		BUILDER_PRICE.classList.add(`${env.clientPrefix}-builder-price`);

		const BUILDER_CAPTION = document.createElement('p');
		BUILDER_CAPTION.classList.add(`${env.clientPrefix}-builder-caption`);
		BUILDER_CAPTION.innerText = this.params.caption;

		TARGET.appendChild(BUILDER_TITLE);
		TARGET.appendChild(BUILDER_PRICE);
		TARGET.appendChild(BUILDER_CAPTION);


		if (!isObjectEmpty(this.params.colors)) {
			this.params.colors.forEach((color) => {
				color.active &&
					TARGET.setAttribute('data-active-color', color.name);
			});

			this._renderColorPicker();
		}

		if (this.params.dropdowns.length) {
			await this._renderDropdowns();
		}

		await this._events();

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
