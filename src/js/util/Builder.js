'use strict';

import Dropdown from './Dropdown';
import {isObjectEmpty} from './helpers/object';
import env from '../../../env';

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

		return (async () => {
			return await this._init();
		})();
	}

	_renderColorPicker(target) {
		if (this.params.colors && !isObjectEmpty(this.params.colors)) {
			const COLOR_PICKER_WRAPPER = document.createElement('div');

			this.params.colors.forEach((color) => {
				const COLOR_WRAPPER = document.createElement('a');
				COLOR_WRAPPER.href = '#';
				COLOR_WRAPPER.innerText = color.name;
				COLOR_WRAPPER.style.color = color.hex;

				COLOR_PICKER_WRAPPER.append(COLOR_WRAPPER);

				const COLOR_EVENT = new CustomEvent('builder.color.change', {
					detail: color.name,
				});

				COLOR_WRAPPER.addEventListener('click', (event) => {
					event.preventDefault();
					target.dispatchEvent(COLOR_EVENT);
				});
			});

			target.prepend(COLOR_PICKER_WRAPPER);
		}

		return this;
	}

	_renderDropdowns(target) {
		this.params.dropdowns.forEach(async (dropdown) => {
			const DROPDOWN = await new Dropdown(dropdown);

			target.append(DROPDOWN.html);
		});

		return this;
	}

	async _events(target) {
		target.addEventListener('builder.color.change', (event) => {
			const ACTIVE_COLOR = target.getAttribute('data-active-color');

			if (ACTIVE_COLOR !== event.detail)
				target.setAttribute('data-active-color', event.detail);
		});
	}

	async _render() {
		const TARGET = document.querySelector(
			`[data-builder-target="${this.params.target}"]`
		);

		if (!TARGET.classList.contains(`${env.clientPrefix}-builder-container`))
			TARGET.classList.add(`${env.clientPrefix}-builder-container`);

		const BUILDER_HTML = `
			<h4>${this.params.title}</h4>
			<h6 id="totalPrice"></h6>
			<p>${this.params.caption}</p>
		`;

		TARGET.innerHTML = BUILDER_HTML;

		if (!isObjectEmpty(this.params.colors)) {
			this.params.colors.forEach((color) => {
				color.active &&
					TARGET.setAttribute('data-active-color', color.name);
			});

			this._renderColorPicker(TARGET);
		}

		if (this.params.dropdowns.length) {
			this._renderDropdowns(TARGET);
		}

		await this._events(TARGET);

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
