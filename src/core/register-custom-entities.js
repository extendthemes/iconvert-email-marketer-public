import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ICONVERTEM_TEMPLATE_ENTITY_TYPE } from '../constants';

const registerCustomEntities = () => {
	dispatch('core').addEntities([
		// {
		// 	name: 'iconvertem-template',
		// 	kind: 'postType',
		// 	baseURL: '/iconvertem/v1/template',
		// 	plural: 'templates',
		// 	label: __( 'Template', 'iconvert-email-marketer' ),
		// 	baseURLParams: { context: 'edit' },
		// 	transientEdits: { blocks: true, selection: true },
		// 	getTitle: ( record ) => {
		// 		return record && record.name;
		// 	},
		// },
		{
			name: ICONVERTEM_TEMPLATE_ENTITY_TYPE,
			kind: 'postType',
			baseURL: '/wp/v2/icem-mail-tpl',
			rawAttributes: ['title', 'excerpt', 'content'],
			plural: 'templates',
			label: __('Template', 'iconvert-email-marketer'),
			baseURLParams: { context: 'edit' },
			transientEdits: { blocks: true, selection: true },
		},
	]);
};
export { registerCustomEntities };
