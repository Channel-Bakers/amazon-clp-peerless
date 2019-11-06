'use strict';

import env from '../../../env';
import {isObjectEmpty, uniqueObjectValues} from './helpers/object';
import {numToCurrency} from './helpers/number';
import {capitalize} from './helpers/string';

export default class Dropdown {
	constructor(params) {
		const defaultParams = {
			title: '',
			id: '',
			data: '',
		};

		this.params = {...defaultParams, ...params};
		this.activeOption = {};
		this.elements = {};

		return (async () => {
			return await this._init();
		})();
	}

	async _sortOptions(options) {
		const OPTIONS = uniqueObjectValues([...options], 'asin');
		const SORTED_OPTIONS = [
			...OPTIONS.sort((a, b) =>
				a.size < b.size ? -1 : a.size > b.size ? 1 : 0
			),
		];

		return SORTED_OPTIONS;
	}

	async _renderOptions(color = false) {
		const ACTIVE_COLOR = color
			? color
			: document
					.querySelector(`.${env.clientPrefix}-builder-container`)
					.getAttribute('data-active-color');

		const OPTIONS = this.params.data[ACTIVE_COLOR];

		const OPTIONS_SORTED = await this._sortOptions(OPTIONS);

		OPTIONS_SORTED.forEach((option) => {
			const OPTION_ELEMENT = document.createElement('option');
			OPTION_ELEMENT.value = option.size;
			OPTION_ELEMENT.innerText = option.size;

			const OPTION_DATA = {
				asin: option.asin,
				price: option.price,
				image: option.image,
				offeringID: option.offeringID,
			};

			OPTION_ELEMENT.setAttribute(
				'data-option-params',
				JSON.stringify(OPTION_DATA)
			);

			this.elements.select.appendChild(OPTION_ELEMENT);
		});

		return this;
	}

	rebuildOptions(color) {
		this.elements.select.innerHTML = '';

		const RENDER = new Promise((resolve, reject) => {
			this._renderOptions(color);
			resolve();
		});

		RENDER.then(() => {
			this._selectChange();
		});

		return this;
	}

	buildATCLink() {
		let atcURL = new URL(this.elements.atc.href);
		atcURL.searchParams.set('offeringID.1', this.activeOption.offeringID);

		this.elements.atc.href = atcURL.href;

		return this;
	}

	_renderATCLink() {
		const CTA = document.createElement('a');
		CTA.classList.add(`${env.clientPrefix}-select-addToCart`);
		CTA.setAttribute('data-select-id', this.params.id);
		CTA.href =
			'https://www.amazon.com/gp/item-dispatch?submit.addToCart=addToCart';
		CTA.innerText = 'Add to Bag';

		this.elements.atc = CTA;

		return CTA;
	}

	_renderSelect() {
		const SELECT_WRAPPER = document.createElement('div');
		SELECT_WRAPPER.classList.add(`${env.clientPrefix}-select-container`);

		this.elements.selectWrapper = SELECT_WRAPPER;

		const SELECT = document.createElement('select');
		SELECT.classList.add(`${env.clientPrefix}-select-dropdown`)
		SELECT.setAttribute('name', this.params.id);
		SELECT.setAttribute('id', this.params.id);

		this.elements.select = SELECT;

		const CTA = this._renderATCLink();

		SELECT_WRAPPER.appendChild(SELECT);
		SELECT_WRAPPER.appendChild(CTA);

		return SELECT_WRAPPER;
	}

	_renderPrice() {
		const PRICE = this.elements.wrapper.querySelector(
			`.${env.clientPrefix}-dropdown-price`
		);
		PRICE.innerText = numToCurrency(this.activeOption.price);
	}

	_renderTitle(color = false) {
		const ACTIVE_COLOR = color
			? color
			: this.params.builder.params.colors.reduce(
					(color) => color.active && color.name
			  );

		const TITLE = document.createElement('h4');
		TITLE.classList.add(`${env.clientPrefix}-dropdown-title`);

		let titleText = this.params.title;
		titleText = titleText.replace('{{COLOR}}', capitalize(ACTIVE_COLOR));

		TITLE.innerText = titleText;

		return TITLE;
	}

	async _render() {
		const DROPDOWN_WRAPPER = document.createElement('div');
		DROPDOWN_WRAPPER.classList.add(
			`${env.clientPrefix}-dropdown-container`
		);

		DROPDOWN_WRAPPER.setAttribute('data-select-id', this.params.id);

		const DROPDOWN_TITLE = this._renderTitle();
		const DROPDOWN_PRICE = document.createElement('h6');
		DROPDOWN_PRICE.classList.add(`${env.clientPrefix}-dropdown-price`);

		DROPDOWN_WRAPPER.appendChild(DROPDOWN_TITLE);
		DROPDOWN_WRAPPER.appendChild(DROPDOWN_PRICE);

		this.elements.wrapper = DROPDOWN_WRAPPER;

		const SELECT_WRAPPER = this._renderSelect();

		DROPDOWN_WRAPPER.appendChild(SELECT_WRAPPER);

		this.html = DROPDOWN_WRAPPER;

		if (!isObjectEmpty(this.params.data)) {
			await this._renderOptions();
		}

		await this._events();
		this._selectChange();

		return this;
	}

	_selectChange() {
		const SELECTED_OPTION = this.elements.select.options[
			this.elements.select.selectedIndex
		];
		const SELECTED_OPTION_DATA = JSON.parse(
			SELECTED_OPTION.getAttribute('data-option-params')
		);

		this.activeOption = SELECTED_OPTION_DATA;

		const OPTION_CHANGE = new CustomEvent('dropdown.option.change', {
			detail: SELECTED_OPTION_DATA,
		});

		this.params.builder.elements.wrapper.dispatchEvent(OPTION_CHANGE);

		this._renderPrice();
		this.buildATCLink();

		return this;
	}

	async _events() {
		const SELECT = this.elements.select;

		SELECT.addEventListener('change', () => {
			this._selectChange();
		});

		SELECT.addEventListener('builder.color.change', (event) => {
			this.rebuildOptions(event.detail.color);

			// update title
			this.elements.wrapper
				.querySelector(`.${env.clientPrefix}-dropdown-title`)
				.replaceWith(this._renderTitle(event.detail.color));
		});

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
