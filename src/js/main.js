import '../scss/main.scss';
import * as jackets from './asins/suits/slim/jackets.json';
import * as pants from './asins/suits/slim/pants.json';
import Builder from './util/Builder';

(() => {
	const slimSuitJackets = jackets.default;
	const slimSuitPants = pants.default;

	const slimSuitOptions = {
		target: 'slimSuit',
		title: `Slim Fit {{COLOR}} Suit`,
		caption:
			"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
		colors: [
			{
				name: 'charcoal',
				hex: '#454f54',
				active: true,
			},
			{
				name: 'black',
				hex: '#000000',
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
