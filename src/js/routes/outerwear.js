'use strict';

import Builder from '../util/Builder';
import * as slimOvercoat from '../asins/outerwear/slim.json';
import * as modenOvercoat from '../asins/outerwear/modern.json';

export default {
	init() {
		// SLIM OVERCOATS
		const SLIM_OVERCOATS = slimOvercoat.default;
		const SLIM_OVERCOAT_OPTIONS = {
			target: 'slimOvercoats',
			title: `Slim Fit {{COLOR}} Overcoat`,
			caption:
				"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
			image: {
				position: 'right',
			},
			colors: [
				{
					name: 'grey',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: true,
				},
				{
					name: 'black',
					hex: '#000000',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
			],
			dropdowns: [
				{
					title: `Slim Fit {{COLOR}} Overcoat`,
					id: 'slimOvercoats',
					data: SLIM_OVERCOATS,
				},
			],
		};

		const SLIM_OVERCOAT_BUILDER = new Builder({
			...SLIM_OVERCOAT_OPTIONS,
		});


		// SOFT JACKETS
		const MODERN_OVERCOATS = modenOvercoat.default;
		const MODERN_OVERCOAT_OPTIONS = {
			target: 'modernOvercoats',
			title: `Modern Fit {{COLOR}} Overcoat`,
			caption:
				"Soft, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
			image: {
				position: 'right',
			},
			colors: [
				{
					name: 'black',
					hex: '#000000',
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
					name: 'royal blue',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
			],
			dropdowns: [
				{
					title: `Modern Fit {{COLOR}} Overcoat`,
					id: 'modernOvercoats',
					data: MODERN_OVERCOATS,
				},
			],
		};

		const MODERN_OVERCOAT_BUILDER = new Builder({
			...MODERN_OVERCOAT_OPTIONS,
		});
	},
};
