'use strict';

import Builder from '../util/Builder';
import * as slimPants from '../asins/pants/slim.json';
import * as skinnyPants from '../asins/pants/skinny.json';

export default {
	init() {
		// SLIM PANTS
		const SLIM_PANTS = slimPants.default;
		const SLIM_PANT_OPTIONS = {
			target: 'slimPants',
			title: `Slim Fit {{COLOR}} Pants`,
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
					name: 'medium grey',
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
					title: `Slim Fit {{COLOR}} Pants`,
					id: 'slimPants',
					data: SLIM_PANTS,
				},
			],
		};

		const SLIM_PANT_BUILDER = new Builder({
			...SLIM_PANT_OPTIONS,
		});


		// SKINNY PANTS
		const SKINNY_PANTS = skinnyPants.default;
		const SKINNY_PANT_OPTIONS = {
			target: 'skinnyPants',
			title: `Skinny Fit {{COLOR}} Pants`,
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
					name: 'light grey',
					hex: '#454f54',
					image:
						'https://images-na.ssl-images-amazon.com/images/I/91euZPBCWbL._AC_UY741_.jpg',
					active: false,
				},
				{
					name: 'medium grey',
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
					title: `Skinny Fit {{COLOR}} Pants`,
					id: 'skinnyPants',
					data: SKINNY_PANTS,
				},
			],
		};

		const SKINNY_PANT_BUILDER = new Builder({
			...SKINNY_PANT_OPTIONS,
		});
	},
};
