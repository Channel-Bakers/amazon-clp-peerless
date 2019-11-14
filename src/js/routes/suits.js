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
			title: `{{COLOR}} Slim Fit Stretch Suit`,
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
						'https://images-na.ssl-images-amazon.com/images/I/61fOtlfSyNL._AC_UY879_.jpg',
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
					title: `Individual Suit Jacket`,
					image: {
						charcoal: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/suits/charcoal/jacket.png',
						black: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/suits/black/jacket.png'
					},
					id: 'slimSuitJackets',
					data: slimSuitJackets,
				},
				{
					title: `Individual Suit Pants`,
					image: {
						charcoal: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/suits/charcoal/pants.png',
						black: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/suits/black/pants.png'
					},
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
