import { __ } from '@wordpress/i18n';

import { BaseControl } from '@wordpress/components';
import classNames from 'classnames';
import { URLInput } from '../url-input';

const LinkControl = ({ label = __('Link', 'kubio'), value, onChange }) => {
	return (
		<>
			<BaseControl
				className={classNames(
					'kubio-link-control-container',
					'kubio-control'
				)}
			>
				<URLInput label={label} value={value} onChange={onChange} />
			</BaseControl>
		</>
	);
};

export { LinkControl };
