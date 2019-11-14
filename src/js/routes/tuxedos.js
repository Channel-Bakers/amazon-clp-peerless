'use strict';

import Builder from '../util/Builder';
import * as tuxedoJackets from '../asins/tuxedos/jackets.json';
import * as tuxedoPants from '../asins/tuxedos/pants.json';

export default {
	init() {
		const tuxedoJacketData = tuxedoJackets.default;
		const tuxedoPantData = tuxedoPants.default;
		const tuxedoOptions = {
			target: 'tuxedo',
			title: `Modern Fit Tuxedo Suit Separates-Custom Blazer & Pant Size Selection`,
			caption:
				"100% Wool, imported, bottom hemmed plain front pocket pant side seam.",
			image: {
				position: 'right',
				src:
					'https://images-na.ssl-images-amazon.com/images/I/81ScI-Cv7TL._AC_UY879_.jpg',
			},
			dropdowns: [
				{
					title: `Modern Fit Jacket`,
					image: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/tuxedos/jacket.jpg',
					id: 'tuxedoJackets',
					data: tuxedoJacketData,
				},
				{
					title: `Modern Fit Pants`,
					image: 'https://cdn.jsdelivr.net/gh/rdimascio/ck@1.4/assets/ck/tuxedos/pants.jpg',
					id: 'tuxedoPants',
					data: tuxedoPantData,
				},
			],
		};

		const tuxedoBuilder = new Builder({
			...tuxedoOptions,
		});
	},

	finalize() {
		
	}
};
