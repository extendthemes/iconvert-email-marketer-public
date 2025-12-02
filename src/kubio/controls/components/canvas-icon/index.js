import { memo } from '@wordpress/element';
import { svgIcons } from '@kubio/constants';
import _ from 'lodash';

const CanvasIcon_ = ({ name, className, ...rest } = {}) => {
	const svg = _.get(svgIcons, name || 'font-awesome/star');
	return (
		<span
			{...rest}
			className={`${className} h-svg-icon`}
			dangerouslySetInnerHTML={{
				__html: svg,
			}}
		/>
	);
};

const CanvasIcon = memo(CanvasIcon_);

const CanvasIconNoMemo = CanvasIcon_;

export { CanvasIcon, CanvasIconNoMemo };
