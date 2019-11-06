'use strict';

import env from '../../../env';
import {isObjectEmpty, uniqueObjectValues} from './helpers/object';

export default class Dropdown {
	constructor(params) {
		const defaultParams = {
			title: '',
			id: '',
			data: '',
		};

		this.params = {...defaultParams, ...params};

		return (async () => {
			return await this._init();
		})();
	}

	async _sortOptions(options) {
		const OPTIONS = uniqueObjectValues([...options], 'asin');
		const SORTED_OPTIONS = [...OPTIONS.sort((a, b) => a.size < b.size ? -1 : a.size > b.size ? 1 : 0)];

		return SORTED_OPTIONS;
	}

	async _renderOptions(select) {

		const ACTIVE_COLOR = document
			.querySelector(`.${env.clientPrefix}-builder-container`)
			.getAttribute('data-active-color');

		const OPTIONS = this.params.data[ACTIVE_COLOR];

		const OPTIONS_SORTED = await this._sortOptions(OPTIONS);

		OPTIONS_SORTED.forEach(option => {
			const OPTION_ELEMENT = document.createElement('option');
			OPTION_ELEMENT.value = option.size;
			OPTION_ELEMENT.innerText = option.size;

			const OPTION_DATA = {
				asin: option.asin,
				price: option.price,
				image: option.image,
				offeringID: option.offeringID
			};

			OPTION_ELEMENT.setAttribute('data-option-params', JSON.stringify(OPTION_DATA));

			select.append(OPTION_ELEMENT);
		});

		return this;
	}

	async _render() {
		const DROPDOWN_WRAPPER = document.createElement('div');
		DROPDOWN_WRAPPER.classList.add(
			`${env.clientPrefix}-dropdown-container`
		);

		DROPDOWN_WRAPPER.setAttribute('data-select-id', this.params.id);

		DROPDOWN_WRAPPER.innerHTML = `
			<h4 class="title">${this.params.title}</h4>
			<p class="price"></p>
		`;

		const SELECT_WRAPPER = document.createElement('div');
		SELECT_WRAPPER.classList.add(`${env.clientPrefix}-select-container`);

		const SELECT = document.createElement('select');
		SELECT.setAttribute('name', this.params.id);
		SELECT.setAttribute('id', this.params.id);

		const CTA = document.createElement('a');
		CTA.href = 'https://www.amazon.com/gp/item-dispatch?submit.addToCart=addToCart';
		CTA.innerText = 'Add to Bag';

		SELECT_WRAPPER.append(SELECT);
		SELECT_WRAPPER.append(CTA);
		DROPDOWN_WRAPPER.append(SELECT_WRAPPER);

		this.html = DROPDOWN_WRAPPER;

		if (!isObjectEmpty(this.params.data)) {
			await this._renderOptions(SELECT);
		}

		await this._events(SELECT);

		return this;
	}

	async _events(select) {
		select.addEventListener('change', () => {
			const SELECTED_OPTION = select.options[select.selectedIndex];
			const SELECTED_OPTION_DATA = JSON.parse(SELECTED_OPTION.getAttribute('data-option-params'));

			console.log(SELECTED_OPTION_DATA.price);
		});

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
