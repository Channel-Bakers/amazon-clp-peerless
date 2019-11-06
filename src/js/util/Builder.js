'use strict';

import Dropdown from './Dropdown';
import {isObjectEmpty} from './helpers/object';
import env from '../../../js-env-variables';

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
			console.log(this.params.colors);
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

	async _events() {
		
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

		await this._events();

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
