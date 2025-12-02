/**
 * WordPress dependencies
 */
import { MoreMenuDropdown } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import ToolsMoreMenuGroup from '../tools-more-menu-group';
import WritingMenu from '../writing-menu';

const MoreMenu = ( { showIconLabels } ) => {
	return <></>;

	// return (
	// 	<MoreMenuDropdown
	// 		toggleProps={ {
	// 			showTooltip: ! showIconLabels,
	// 			...( showIconLabels && { variant: 'tertiary' } ),
	// 		} }
	// 	>
	// 		{ ( { onClose } ) => (
	// 			<>
	// 				<WritingMenu />
	// 				<ToolsMoreMenuGroup.Slot fillProps={ { onClose } } />
	// 			</>
	// 		) }
	// 	</MoreMenuDropdown>
	// );
};

export default MoreMenu;
