import { createRoot, StrictMode } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import './style.scss';
import { App } from './app';
import { registerCustomEntities } from '../core';

const init = () => {
	const rootElement = document.querySelector('#iconvertem-admin-page');
	if (!rootElement) {
		//console.error('Root element not found:', rootElementId);
		throw new Error('Root element not found');
		return;
	}

	const root = createRoot(rootElement);
	registerCustomEntities();
	domReady(function () {
		root.render(
			<StrictMode>
				<App />
			</StrictMode>
		);
	});
};

// @ts-ignore
window.iconvertemInit = init;
