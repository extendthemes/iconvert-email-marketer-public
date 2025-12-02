import { setDefaultBlockName } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
// import Editor from './editor';
import '../blocks/blocks';
import Editor from './editor';
import '../format-library/index';

// import { patterns } from './patterns';
import './style.scss';
// import { patternsCategories } from './patterns-categories';
import { registerCustomEntities } from '../core';

function setUpEditor(settings) {
	registerCustomEntities();
	setDefaultBlockName(null);
}

domReady(function () {
	const settings = window.iconvertemRichText || {};
	setUpEditor(settings);

	settings.__experimentalBlockPatterns = [];
	settings.__experimentalBlockPatternCategories = [];
	settings.outlineMode = true;

	render(
		<Editor settings={settings} />,
		document.getElementById('iconvertem-richtext-block-editor')
	);
});
