import { Properties } from './properties';
import { Style } from './style';
import { InspectorControls } from '@wordpress/block-editor';
import { DebugControl } from '@iconvertem/components/common/utility/controls/debug/index';

const IconvertInspector = ( props ) => {
	return (
		<InspectorControls>
			<Properties { ...props } />
			<Style { ...props } />
		</InspectorControls>
	);
};

export { IconvertInspector };
