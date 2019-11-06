import '../scss/main.scss';
import * as jackets from './asins/suits/slim/jackets.json';
import * as pants from './asins/suits/slim/pants.json';
import Builder from './util/Builder';

(() => {
	const slimSuitJackets = jackets.default;
	const slimSuitPants = pants.default;

	const slimSuitBuilder = new Builder({
		target: 'slimSuit',
		title: 'Lazio Grey Suit',
		caption:
			"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
		colors: [
			{
				name: 'charcoal',
				hex: '#DDDDDD',
				active: true
			},
			{
				name: 'black',
				hex: '#000000',
			},
		],
		dropdowns: [
			{
				title: 'Lazio Dark Grey Jacket',
				id: 'slimSuitJackets',
				data: slimSuitJackets,
			},
			{
				title: 'Dark Grey Brescia Trousers',
				id: 'slimSuitPants',
				data: slimSuitPants,
			},
		],
	});

	// console.log(slimSuitBuilder);
	// console.log(`Jackets: `, slimSuitJackets);
	// console.log(`Pants: `, slimSuitPants);
})();
