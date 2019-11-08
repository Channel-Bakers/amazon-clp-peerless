import '../scss/main.scss';
import routes from './routes/routes';
import {isAmazon, isAmazonAdvertising} from './util/helpers/amazon';
import {getCookie} from './util/helpers/cookies';

(() => {
	const init = () => {
		const DEV_ROUTE = 'suits';

		if (isAmazon()) {
			let CB = {};
			window.CB = CB;
			CB.sessionID = getCookie('session-id');

			const FALLBACK_NODE = '.carousel-wrap';
			const FALLBACK_NODES = document.querySelectorAll(FALLBACK_NODE);

			if (FALLBACK_NODES) {
				FALLBACK_NODES.forEach((node) => {
					node.remove();
				});
			}

			const PRIMARY_ROUTE = 'suits';
			const LOCATION = window.location.href;

			try {
				const URL = new URL(LOCATION);

				if (URL.searchParams.has('tab')) {
					const TAB = URL.searchParams.get('tab').toLowerCase();
					routes[TAB].init();
				} else {
					routes[PRIMARY_ROUTE].init();
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			routes[DEV_ROUTE].init();
		}
	};

	const watchForNewNodes = (mutations, observer) => {
		mutations.forEach((mutation) => {
			if (!mutation.addedNodes) return;

			for (var i = 0; i < mutation.addedNodes.length; i++) {
				const NODE = mutation.addedNodes[i];

				if (
					NODE instanceof Node &&
					NODE.hasAttribute('id') &&
					NODE.getAttribute('id') === 'ad-landing-page-wrap'
				) {
					init();
					observer.disconnect();
				}
			}
		});
	};

	const TARGET_NODE = document.body;
	const CONFIG = {childList: true, subtree: true};
	const OBSERVER = new MutationObserver(watchForNewNodes);

	(() => {
		if (isAmazon()) {
			if (!document.getElementById('ad-landing-page-wrap')) {
				OBSERVER.observe(TARGET_NODE, CONFIG);
			} else {
				init();
			}
		} else {
			if (!isAmazonAdvertising()) {
				init();
			}
		}
	})();
})();
