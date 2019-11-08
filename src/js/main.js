import '../scss/main.scss';
import routes from './routes/routes';
import {isAmazon, isAmazonAdvertising, getCurrentAmazonTab} from './util/helpers/amazon';
import {getCookie} from './util/helpers/cookies';

(() => {
	const init = () => {
		const DEV_ROUTE = 'suits';

		if (isAmazon()) {
			let CB = {};
			window.CB = CB;
			CB.sessionID = getCookie('session-id');
			CB.tab = getCurrentAmazonTab();

			const FALLBACK_NODE = '.carousel-wrap';
			const FALLBACK_NODES = document.querySelectorAll(FALLBACK_NODE);

			if (FALLBACK_NODES) {
				FALLBACK_NODES.forEach((node) => {
					node.remove();
				});
			}

			const PRIMARY_ROUTE = 'suits';
			const CURRENT_ROUTE = CB.tab;

			if (CB.tab) {
				routes[CURRENT_ROUTE].init();
			} else {
				routes[PRIMARY_ROUTE].init();
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
