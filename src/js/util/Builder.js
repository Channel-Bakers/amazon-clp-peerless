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
			colors: [],
			dropdowns: [],
		};

		this.params = {...defaultParams, ...params};
		this.dropdowns = [];
		this.elements = {};

		return (async () => {
			return await this._init();
		})();
	}

	_getActiveColor() {
		return this.params.colors.reduce((color) => color.active && color);
	}

	_renderColorPicker() {
		if (this.params.colors && !isObjectEmpty(this.params.colors)) {
			const COLOR_PICKER_WRAPPER = document.createElement('div');
			COLOR_PICKER_WRAPPER.classList.add(
				`${env.clientPrefix}-color-picker-container`
			);

			this.params.colors.forEach((color) => {
				const COLOR_WRAPPER = document.createElement('a');

				COLOR_WRAPPER.classList.add(
					`${env.clientPrefix}-color-container`
				);
				if (color.active) COLOR_WRAPPER.classList.add('active');

				COLOR_WRAPPER.href = '#';
				COLOR_WRAPPER.setAttribute('title', color.name);
				COLOR_WRAPPER.style.backgroundColor = color.hex;

				COLOR_PICKER_WRAPPER.appendChild(COLOR_WRAPPER);

				const COLOR_EVENT = new CustomEvent('builder.color.change', {
					detail: {color: {...color}},
				});

				COLOR_WRAPPER.addEventListener('click', (event) => {
					event.preventDefault();

					const COLORS = document.querySelectorAll(
						`.${env.clientPrefix}-color-container`
					);

					COLORS.forEach((color) => {
						color.classList.remove('active');
					});

					event.target.classList.add('active');

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
				this.elements.wrapper.appendChild(DROPDOWN.html);

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
		const TITLE = document.createElement('h4');
		TITLE.classList.add(`${env.clientPrefix}-builder-title`);

		let titleText = this.params.title;

		if (this.params.colors && this.params.colors.length > 0) {
			const ACTIVE_COLOR = color ? color : this._getActiveColor();
			titleText = titleText.replace(
				'{{COLOR}}',
				capitalize(
					typeof ACTIVE_COLOR !== 'object'
						? ACTIVE_COLOR
						: ACTIVE_COLOR.name
				)
			);
		}

		TITLE.innerText = titleText;

		return TITLE;
	}

	async _events() {
		const TARGET = this.elements.wrapper;

		TARGET.addEventListener('builder.color.change', (event) => {
			const ACTIVE_COLOR = TARGET.getAttribute('data-active-color');

			if (ACTIVE_COLOR !== event.detail.color.name) {
				TARGET.setAttribute(
					'data-active-color',
					event.detail.color.name
				);

				// update title
				this.elements.wrapper
					.querySelector(`.${env.clientPrefix}-builder-title`)
					.replaceWith(this._renderTitle(event.detail.color.name));

				// update image
				this.elements.image.style.backgroundImage = `url('${event.detail.color.image}')`;
			}
		});

		TARGET.addEventListener('dropdown.option.change', (event) => {
			this._renderPrice();
		});
	}

	async _render() {
		const WRAPPER = document.querySelector(
			`[data-builder-target="${this.params.target}"]`
		);

		WRAPPER.classList.add(`${env.clientPrefix}-container`);

		const TARGET = document.createElement('div');

		if (!TARGET.classList.contains(`${env.clientPrefix}-builder-container`))
			TARGET.classList.add(`${env.clientPrefix}-builder-container`);

		WRAPPER.appendChild(TARGET);
		this.elements.wrapper = TARGET;

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

		if (this.params.image) {
			const IMAGE_POSITION = this.params.image.position;

			if (IMAGE_POSITION)
				TARGET.classList.add(
					IMAGE_POSITION === 'right' ? 'left' : 'right'
				);

			const IMAGE_WRAPPER = document.createElement('div');
			IMAGE_WRAPPER.classList.add(`${env.clientPrefix}-image-container`);

			const IMAGE = document.createElement('div');
			IMAGE.classList.add(`${env.clientPrefix}-image`);

			const COLORS = this.params.colors && this.params.colors.length > 0;

			const ACTIVE_COLOR = COLORS
				? this._getActiveColor()
				: this.params.image

			const IMAGE_SRC = COLORS
				? typeof ACTIVE_COLOR !== 'object'
					? ACTIVE_COLOR
					: ACTIVE_COLOR.image
				: this.params.image.src
				? this.params.image.src
				: null;

			IMAGE.style.backgroundImage = `url('${IMAGE_SRC}')`;

			if (IMAGE_SRC) IMAGE_WRAPPER.appendChild(IMAGE);

			this.elements.image = IMAGE;

			const ATTACH_METHOD =
				IMAGE_POSITION && IMAGE_POSITION === 'right'
					? 'appendChild'
					: 'prepend';

			WRAPPER[ATTACH_METHOD](IMAGE_WRAPPER);
		}

		await this._events();

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
