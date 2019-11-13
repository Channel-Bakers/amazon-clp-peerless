'use strict';

import Builder from '../util/Builder';
import * as slimJackets from '../asins/suits/jackets.json';
import * as slimPants from '../asins/suits/pants.json';

export default {
	init() {
		const slimSuitJackets = slimJackets.default;
		const slimSuitPants = slimPants.default;
		const slimSuitOptions = {
			target: 'slimSuit',
			title: `{{COLOR}} Slim Fit Stretch Suit Separates-Custom Jacket & Pant Size Selection`,
			caption:
				"High performance bi-stretch fabric for maximum comfort and movement. Slim through the shoulders, chest, and waist with higher arm hole and tapered sleeve.",
			image: {
				position: 'left',
			},
			colors: [
				{
					name: 'charcoal',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/61grhh2qwmL._AC_UY741_.jpg',
					active: true,
				},
				{
					name: 'black',
					hex: '#000000',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/61NhWRvi5eL._AC_SY679._SX._UX._SY._UY_.jpg',
					active: false,
				},
			],
			dropdowns: [
				{
					title: `{{COLOR}} Slim Fit Stretch Jacket`,
					id: 'slimSuitJackets',
					data: slimSuitJackets,
				},
				{
					title: `{{COLOR}} Slim Fit Stretch Pants`,
					id: 'slimSuitPants',
					data: slimSuitPants,
				},
			],
		};

		const slimSuitBuilder = new Builder({
			...slimSuitOptions,
		});
	},

	finalize() {

	}
};
