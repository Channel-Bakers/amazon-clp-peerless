'use strict';

import Builder from '../util/Builder';
import * as tuxedoJackets from '../asins/tuxedos/jackets.json';
import * as tuxedoPants from '../asins/tuxedos/pants.json';

export default {
	init() {
		console.log('Tuxedos');

		const tuxedoJacketData = tuxedoJackets.default;
		const tuxedoPantData = tuxedoPants.default;
		const tuxedoOptions = {
			target: 'tuxedo',
			backgroundColor: '#f2f1f6',
			title: `Tuxedo`,
			caption:
				"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
			image: {
				position: 'right',
				src:
					'https://images-na.ssl-images-amazon.com/images/I/61X0YLXDviL._AC_UX569_.jpg',
			},
			dropdowns: [
				{
					title: `Tuxedo Jacket`,
					id: 'tuxedoJackets',
					data: tuxedoJacketData,
				},
				{
					title: `Tuxedo Pants`,
					id: 'tuxedoPants',
					data: tuxedoPantData,
				},
			],
		};

		const tuxedoBuilder = new Builder({
			...tuxedoOptions,
		});
	},
};
