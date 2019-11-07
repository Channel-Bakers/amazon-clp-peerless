import '../scss/main.scss';
import * as jackets from './asins/suits/slim/jackets.json';
import * as pants from './asins/suits/slim/pants.json';
import Builder from './util/Builder';
import {getCookie} from './util/helpers/cookies';

(() => {
	let CB = {};
    window.CB = CB;
    CB.sessionID = getCookie('session-id');

	const slimSuitJackets = jackets.default;
	const slimSuitPants = pants.default;

	const slimSuitOptions = {
		target: 'slimSuit',
		title: `Slim Fit {{COLOR}} Suit`,
		caption:
			"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
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
				title: `Slim Fit {{COLOR}} Jacket`,
				id: 'slimSuitJackets',
				data: slimSuitJackets,
			},
			{
				title: `Slim Fit {{COLOR}} Pants`,
				id: 'slimSuitPants',
				data: slimSuitPants,
			},
		],
	};

	const slimSuitBuilder = new Builder({
		...slimSuitOptions,
	});
})();
