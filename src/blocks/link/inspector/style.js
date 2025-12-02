import { __ } from '@wordpress/i18n';
import { Background } from '@iconvertem/components/common/panel/background';
import { BorderControl } from '@iconvertem/components/common/panel/border';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import { SpacingBlockControl } from '@iconvertem/components/common/panel/spacingBlock';
import { TextAlignBlockControl } from '@iconvertem/components/common/panel/textAlignBlock';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import { KubioPanelBody } from '@kubio/controls';

import { DataProvider } from '../../blocks';
import blockJson from '../block.json';

const Style = ( props ) => {
	const { attributes, setAttributes } = props;

	return (
		<KubioPanelBody
			title={ __( 'Style', 'iconvert-email-marketer' ) }
			initialOpen={ false }
		>
			<DataProvider.Provider
				value={ { blockJson, attributes, setAttributes } }
			>
				<TextAlignBlockControl { ...props } />
				<TypographyControl { ...props } />
				<Background { ...props } />
				<BorderControl { ...props } isRadius={ true } />
				<SpacingControl { ...props } />
				<SpacingBlockControl { ...props } />
			</DataProvider.Provider>
		</KubioPanelBody>
	);
};

export { Style };
