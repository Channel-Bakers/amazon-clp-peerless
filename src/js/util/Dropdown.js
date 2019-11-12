'use strict';

import env from '../../../env';
import {
	isObjectEmpty,
	uniqueObjectValues,
	serializeObject,
} from './helpers/object';
import {numToCurrency} from './helpers/number';
import {capitalize} from './helpers/string';
import {getCookie} from './helpers/cookies';

export default class Dropdown {
	constructor(params) {
		const defaultParams = {
			title: '',
			id: '',
			data: [],
		};

		this.params = {...defaultParams, ...params};
		this.activeOption = {};
		this.elements = {};

		return (async () => {
			return await this._init();
		})();
	}

	_getActiveColor() {
		return this.params.builder.params.colors.reduce(
			(color) => color.active && color
		);
	}

	async _sortOptions(options) {
		try {
			const OPTIONS = uniqueObjectValues([...options], 'asin');
			const SORTED_OPTIONS = [
				...OPTIONS.sort((a, b) =>
					a.size < b.size ? -1 : a.size > b.size ? 1 : 0
				),
			];

			return SORTED_OPTIONS;
		} catch (error) {
			console.log(error);
		}
	}

	async _renderOptions(color = false) {
		const COLORS =
			this.params.builder.params.colors &&
			this.params.builder.params.colors.length > 0;

		const ACTIVE_COLOR = COLORS
			? color
				? color
				: this._getActiveColor()
			: null;

		const OPTIONS = COLORS
			? this.params.data[ACTIVE_COLOR.name || ACTIVE_COLOR]
			: this.params.data;

		const OPTIONS_SORTED = await this._sortOptions(OPTIONS);

		try {
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
		} catch (error) {
			console.log(error);
		}

		return this;
	}

	async rebuildOptions(color) {
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
		let atcURL = new URL('https://www.amazon.com/gp/item-dispatch/');
		atcURL.searchParams.set('submit.addToCart', 'addToCart');
		atcURL.searchParams.set('offeringID.1', this.activeOption.offeringID);

		const SESSION_ID =
			(window.CB && window.CB.sessionID) || getCookie('session-id');

		if (SESSION_ID) atcURL.searchParams.set('session-id', SESSION_ID);

		this.elements.atc.href = atcURL.href;

		return this;
	}

	_renderATCLink() {
		const CTA = document.createElement('a');
		CTA.classList.add(`${env.clientPrefix}-select-addToCart`);
		CTA.setAttribute('data-select-id', this.params.id);
		CTA.href = '#';
		CTA.innerText = 'Add to Bag';

		this.elements.atc = CTA;

		return CTA;
	}

	_renderSelect() {
		const SELECT_WRAPPER = document.createElement('div');
		SELECT_WRAPPER.classList.add(`${env.clientPrefix}-select-container`);

		this.elements.selectWrapper = SELECT_WRAPPER;

		const SELECT = document.createElement('select');
		SELECT.classList.add(`${env.clientPrefix}-select-dropdown`);
		SELECT.setAttribute('name', this.params.id);
		SELECT.setAttribute('id', this.params.id);

		this.elements.select = SELECT;

		const CTA = this._renderATCLink();

		SELECT_WRAPPER.appendChild(SELECT);
		SELECT_WRAPPER.appendChild(CTA);

		return SELECT_WRAPPER;
	}

	_parsePrice(html) {
		const PRICES = {};
		let regularPrice;
		let salePrice;

		try {
			const AVAILABILITY = html.getElementById('availability');
			const OUT_OF_STOCK = AVAILABILITY.querySelector(
				'span'
			).innerText.includes('out of stock');

			if (OUT_OF_STOCK) {
				PRICES.salePrice = null;
				PRICES.regularPrice = null;
				PRICES.available = false;
				return PRICES;
			}

			const PRICE_TABLE = html.querySelector('#price');
			let prices = [];

			if (PRICE_TABLE) {
				PRICE_TABLE.querySelectorAll(
					'tr:not(#regularprice_savings):not(.aok-hidden) td > span:not(#listPriceLegalMessage):not(#ourprice_shippingmessage)'
				).forEach(function(element) {
					if (element.innerText.includes('$')) {
						if (
							'primeExclusivePricingMessage' ===
							element.getAttribute('id')
						) {
							let primePrice = element
								.querySelector('a:not(span)')
								.innerText.trim()
								.split('$')[1]
								.split(' ')[0]
								.split(',')
								.join('');
							primePrice = parseFloat(primePrice);
							if (!isNaN(primePrice) && prices.length) {
								prices.push(prices[0] - primePrice);
							}
						} else {
							let thisElement = element.innerText
								.trim()
								.split('$')[1]
								.split(',')
								.join('');
							thisElement = parseFloat(thisElement);
							if (!isNaN(thisElement)) {
								prices.push(thisElement);
							}
						}
					}
				});
			}

			switch (prices.length) {
				case 0:
					salePrice = null;
					regularPrice = null;
					break;
				case 1:
					salePrice = prices[0];
					regularPrice = null;
					break;
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					salePrice = Math.min(...prices);
					regularPrice = Math.max(...prices);
					break;
			}

			if (regularPrice) PRICES.regularPrice = regularPrice;

			if (salePrice) PRICES.salePrice = salePrice;

			PRICES.available = true;

			return PRICES;
		} catch (error) {
			console.log(error);
		}
	}

	async _scrapePrice() {
		const ASIN = this.activeOption.asin;
		const PROXY = window.location.host.includes('amazon')
			? ''
			: 'https://cors-anywhere.herokuapp.com/';

		try {
			const ASIN_REQUEST = await fetch(
				`${PROXY}https://www.amazon.com/dp/${ASIN}?th=1&psc=1`
			);

			const ASIN_RESPONSE = await ASIN_REQUEST.text();

			const PARSER = new DOMParser();
			const HTML = PARSER.parseFromString(ASIN_RESPONSE, 'text/html');

			const PRICES = this._parsePrice(HTML);

			return PRICES &&
				typeof PRICES === 'object' &&
				!isObjectEmpty(PRICES)
				? PRICES
				: this.activeOption.price;
		} catch (error) {
			console.log(error);
			return this.activeOption.price;
		}
	}

	async _renderPrice() {
		const PRICE_WRAPPER = this.elements.wrapper.querySelector(
			`.${env.clientPrefix}-dropdown-price`
		);

		PRICE_WRAPPER.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
				<defs>
					<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
						<stop stop-color="#7B827B" stop-opacity="0" offset="0%"/>
						<stop stop-color="#7B827B" stop-opacity=".631" offset="63.146%"/>
						<stop stop-color="#7B827B" offset="100%"/>
					</linearGradient>
				</defs>
				<g fill="none" fill-rule="evenodd">
					<g transform="translate(1 1)">
						<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3" transform="rotate(293.261 18 18)">
							<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
						</path>
						<circle fill="#7B827B" cx="36" cy="18" r="1" transform="rotate(293.261 18 18)">
							<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
						</circle>
					</g>
				</g>
			</svg>`;

		const PRICES = await this._scrapePrice();

		PRICE_WRAPPER.innerHTML = '';

		if (typeof PRICES === 'object') {
			if (PRICES.available) {
				Object.entries(PRICES).forEach(([key, value]) => {

					if (key !== 'available') {
						const PRICE_EL = document.createElement('span');
						PRICE_EL.classList.add(key);
						PRICE_EL.innerText = numToCurrency(value);
		
						const ATTACH_METHOD =
							key === 'salePrice' ? 'appendChild' : 'prepend';
		
						PRICE_WRAPPER[ATTACH_METHOD](PRICE_EL);
	
						if (this.elements.atc.classList.contains('disabled')) {
							this.elements.atc.classList.remove('disabled');
						}
					}
				});
			} else {
				const PRICE_EL = document.createElement('span');
				PRICE_EL.classList.add('outOfStock');
				PRICE_EL.innerText = 'Out of Stock';
	
				PRICE_WRAPPER.appendChild(PRICE_EL);

				if (!this.elements.atc.classList.contains('disabled')) {
					this.elements.atc.classList.add('disabled');
				}
			}
		} else {
			const PRICE_EL = document.createElement('span');
			PRICE_EL.classList.add('salePrice');
			PRICE_EL.innerText = numToCurrency(PRICES);

			PRICE_WRAPPER.appendChild(PRICE_EL);

			if (this.elements.atc.classList.contains('disabled')) {
				this.elements.atc.classList.remove('disabled');
			}
		}

		const PRICE_CHANGE = new CustomEvent('dropdown.price.update', {
			detail: PRICES,
		});

		this.params.builder.elements.wrapper.dispatchEvent(PRICE_CHANGE);

		return this;
	}

	_renderTitle(color = false) {
		const TITLE = document.createElement('h4');
		TITLE.classList.add(`${env.clientPrefix}-dropdown-title`);

		let titleText = this.params.title;

		if (
			this.params.builder.params.colors &&
			this.params.builder.params.colors.length > 0
		) {
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

	async _render() {
		const DROPDOWN_WRAPPER = document.createElement('div');
		DROPDOWN_WRAPPER.classList.add(
			`${env.clientPrefix}-dropdown-container`
		);

		DROPDOWN_WRAPPER.setAttribute('data-select-id', this.params.id);

		// if (
		// 	this.params.builder.params.dropdowns &&
		// 	this.params.builder.params.dropdowns.length > 1
		// ) {
		// 	const DROPDOWN_TITLE = this._renderTitle();
		// 	const DROPDOWN_PRICE = document.createElement('h6');
		// 	DROPDOWN_PRICE.classList.add(`${env.clientPrefix}-dropdown-price`);

		// 	DROPDOWN_WRAPPER.appendChild(DROPDOWN_TITLE);
		// 	DROPDOWN_WRAPPER.appendChild(DROPDOWN_PRICE);
		// }

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

		const SELECTED_OPTION_DATA = SELECTED_OPTION
			? JSON.parse(SELECTED_OPTION.getAttribute('data-option-params'))
			: null;

		this.activeOption = SELECTED_OPTION_DATA;

		const OPTION_CHANGE = new CustomEvent('dropdown.option.change', {
			detail: SELECTED_OPTION_DATA ? {...SELECTED_OPTION_DATA} : null,
		});

		this.params.builder.elements.wrapper.dispatchEvent(OPTION_CHANGE);

		this._renderPrice();
		this.buildATCLink();

		return this;
	}

	async _events() {
		const SELECT = this.elements.select;
		const ATC = this.elements.atc;

		SELECT.addEventListener('change', () => {
			this._selectChange();
		});

		SELECT.addEventListener('builder.color.change', (event) => {
			this.rebuildOptions(event.detail.color.name);

			// update title
			this.elements.wrapper
				.querySelector(`.${env.clientPrefix}-dropdown-title`)
				.replaceWith(this._renderTitle(event.detail.color.name));
		});

		ATC.addEventListener('click', async (event) => {
			event.preventDefault();

			if (event.target.classList.contains('diabled')) {
				return false;
			}

			const SESSION_ID =
				(window.CB && window.CB.sessionID) || getCookie('session-id');

			if (SESSION_ID) {
				try {
					const LOADING_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
						<defs>
							<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
								<stop stop-color="#7B827B" stop-opacity="0" offset="0%"/>
								<stop stop-color="#7B827B" stop-opacity=".631" offset="63.146%"/>
								<stop stop-color="#7B827B" offset="100%"/>
							</linearGradient>
						</defs>
						<g fill="none" fill-rule="evenodd">
							<g transform="translate(1 1)">
								<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="3" transform="rotate(293.261 18 18)">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
								</path>
								<circle fill="#7B827B" cx="36" cy="18" r="1" transform="rotate(293.261 18 18)">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/>
								</circle>
							</g>
						</g>
					</svg>`;

					const LOADED_ICON = `<svg width="19px" height="14px" viewBox="0 0 19 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
								<polyline id="Line" stroke="#007600" stroke-width="2" points="2 7.33333333 7 12 17.6452904 1.61165461"></polyline>
							</g>
						</svg>`;

					const ATC_DATA = {
						verificationSessionID: SESSION_ID,
						offerListingID: this.activeOption.offeringID,
						quantity: '1',
						ASIN: this.activeOption.asin,
					};

					const ATC_REQUEST = await fetch(
						'https://www.amazon.com/gp/add-to-cart/json',
						{
							method: 'POST',
							headers: {
								'Content-Type':
									'application/x-www-form-urlencoded',
							},
							body: serializeObject(ATC_DATA),
						}
					);

					const LOADER_WRAPPER = document.createElement('div');
					const LOADER_CONTENT = document.createElement('div');
					const LOADER = document.createElement('div');

					LOADER_WRAPPER.classList.add('loading-wrapper');
					LOADER_WRAPPER.classList.add('is-loading');
					LOADER_CONTENT.classList.add('loading-content');
					LOADER.classList.add('loading');
					LOADER.innerHTML = LOADING_ICON;

					LOADER_CONTENT.appendChild(LOADER);
					LOADER_WRAPPER.appendChild(LOADER_CONTENT);
					document.body.appendChild(LOADER_WRAPPER);

					const ATC_RESPONSE = await ATC_REQUEST.json();

					if (ATC_RESPONSE.isOK && ATC_RESPONSE.cartQuantity) {
						const CART = document.getElementById('nav-cart-count');

						if (CART) CART.innerHTML = ATC_RESPONSE.cartQuantity;

						LOADER_WRAPPER.classList.remove('is-loading');
						LOADER_WRAPPER.classList.add('is-loaded');

						LOADER.innerHTML = LOADED_ICON;
						LOADER.innerHTML += '<h4>Added to Cart</h4>';

						setTimeout(() => {
							LOADER_WRAPPER.outerHTML = '';
						}, 1000);
					}
				} catch (error) {
					window.open(event.target.href, '_blank');
				}
			} else {
				window.open(event.target.href, '_blank');
			}
		});

		return this;
	}

	async _init() {
		await this._render();

		return this;
	}
}
