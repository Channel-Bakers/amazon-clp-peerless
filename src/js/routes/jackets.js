'use strict';

import Builder from '../util/Builder';
import * as slimJackets from '../asins/jackets/slim.json';
import * as softJackets from '../asins/jackets/soft.json';

export default {
	init() {
		// SLIM JACKETS
		const SLIM_JACKETS = slimJackets.default;
		const SLIM_JACKET_OPTIONS = {
			target: 'slimJackets',
			title: `Slim Fit {{COLOR}} Jacket`,
			caption:
				"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
			image: {
				position: 'right',
			},
			colors: [
				{
					name: 'gray',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: true,
				},
				{
					name: 'charcoal',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
				{
					name: 'navy',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
			],
			dropdowns: [
				{
					title: `Slim Fit {{COLOR}} Jacket`,
					id: 'slimJackets',
					data: SLIM_JACKETS,
				},
			],
		};

		const SLIM_JACKET_BUILDER = new Builder({
			...SLIM_JACKET_OPTIONS,
		});


		// SOFT JACKETS
		const SOFT_JACKETS = softJackets.default;
		const SOFT_JACKET_OPTIONS = {
			target: 'softJackets',
			title: `Soft Fit {{COLOR}} Jacket`,
			caption:
				"Soft, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
			image: {
				position: 'right',
			},
			colors: [
				{
					name: 'denim',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: true,
				},
				{
					name: 'charcoal',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
			],
			dropdowns: [
				{
					title: `Soft Fit {{COLOR}} Jacket`,
					id: 'softJackets',
					data: SOFT_JACKETS,
				},
			],
		};

		const SOFT_JACKET_BUILDER = new Builder({
			...SOFT_JACKET_OPTIONS,
		});
	},
};
