import '../scss/main.scss';
import * as slimJackets from './asins/suits/slim/jackets.json';
import * as slimPants from './asins/suits/slim/pants.json';
import * as tuxedoJackets from './asins/tuxedos/jackets.json';
import * as tuxedoPants from './asins/tuxedos/pants.json';
import Builder from './util/Builder';
import {getCookie} from './util/helpers/cookies';

(() => {
	const init = (amazon = false) => {
		if (amazon) {
			let CB = {};
			window.CB = CB;
			CB.sessionID = getCookie('session-id');
		}

		const slimSuitJackets = slimJackets.default;
		const slimSuitPants = slimPants.default;
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

		const FALLBACK_NODE = '.carousel-wrap';
		const FALLBACK_NODES = document.querySelectorAll(FALLBACK_NODE);

		if (FALLBACK_NODES) {
			FALLBACK_NODES.forEach((node) => {
				node.remove();
			});
		}

		const slimSuitBuilder = new Builder({
			...slimSuitOptions,
		});

		// const tuxedoJacketData = tuxedoJackets.default;
		// const tuxedoPantData = tuxedoPants.default;
		// const tuxedoOptions = {
		// 	target: 'tuxedo',
		// 	title: `Tuxedo`,
		// 	caption:
		// 		"Slim, polished, and versatile enough for just about any occasion. This handsome grey Lazio suit is cut from pure S110's wool by Vitale Barberis Canonico.",
		// 	image: {
		// 		position: 'right',
		// 		src:
		// 			'https://images-na.ssl-images-amazon.com/images/I/61X0YLXDviL._AC_UX569_.jpg',
		// 	},
		// 	dropdowns: [
		// 		{
		// 			title: `Tuxedo Jacket`,
		// 			id: 'tuxedoJackets',
		// 			data: tuxedoJacketData,
		// 		},
		// 		{
		// 			title: `Tuxedo Pants`,
		// 			id: 'tuxedoPants',
		// 			data: tuxedoPantData,
		// 		},
		// 	],
		// };

		// const tuxedoBuilder = new Builder({
		// 	...tuxedoOptions,
		// });
	};

	const watchForNewNodes = (mutations, observer) => {
		mutations.forEach((mutation) => {
			if (!mutation.addedNodes) return;

			for (var i = 0; i < mutation.addedNodes.length; i++) {
				const NODE = mutation.addedNodes[i];

				console.log(NODE);

				if (
					NODE instanceof Node &&
					NODE.hasAttribute('id') &&
					NODE.getAttribute('id') === 'ad-landing-page-wrap'
				) {
					init(true);
					observer.disconnect();
				}
			}
		});
	};

	const TARGET_NODE = document.body;
	const CONFIG = {childList: true, subtree: true};
	const OBSERVER = new MutationObserver(watchForNewNodes);

	(() => {
		// If this is the first page load, use mutation observer to wait for our LP wrapper to appear
		switch (window.location.host) {
			case 'advertising.amazon.com':
				break;

			case 'amazon.com':
			case 'www.amazon.com':
				if (!document.getElementById('ad-landing-page-wrap')) {
					OBSERVER.observe(TARGET_NODE, CONFIG);
				} else {
					init();
				}
				break;

			default:
				init();
				break;
		}

		// If tab is clicked, skip mutation observer and just call init()
	})();
})();
