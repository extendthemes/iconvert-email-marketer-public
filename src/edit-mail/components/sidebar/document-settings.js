import { KubioPanelBody } from '@kubio/controls';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { usePostProviderContext } from '../../post-provider';
import { MailContainerContentTabControls } from '@iconvertem/blocks/mail-container/inspector/content';
const DocumentSettingsBase = ({
	mailContainerBlock,
	setMailContainerAttributes,
}) => {
	return (
		<KubioPanelBody
			title={__('General Settings', 'iconvert-email-marketer')}
			initialOpen={true}
		>
			{mailContainerBlock && (
				<MailContainerContentTabControls
					attributes={mailContainerBlock?.attributes}
					setAttributes={setMailContainerAttributes}
					mailContainerClientId={mailContainerBlock?.clientId}
				/>
			)}
			{!mailContainerBlock && (
				<div>
					{__(
						'Missing mail container block',
						'iconvert-email-marketer'
					)}
				</div>
			)}
		</KubioPanelBody>
	);
};

const DocumentSettings = compose(
	createHigherOrderComponent(
		(WrappedComponent) => (props) => {
			const postData = usePostProviderContext();
			return <WrappedComponent {...props} postData={postData} />;
		},
		'withPostData'
	),
	withSelect((select, { postData }) => {
		const { getBlocks } = select('core/block-editor') || {};
		const blocks = getBlocks?.() || [];
		const mailContainerBlock = blocks?.find?.(
			(block) => block?.name === 'extendstudio/mail-container'
		);

		return { mailContainerBlock, blocks };
	}),
	withDispatch(
		(dispatch, { style, mailContainerBlock, postData, blocks }) => {
			const {
				updateBlockAttributes,
				__unstableMarkLastChangeAsPersistent,
			} = dispatch('core/block-editor');
			const setMailContainerAttributes = (changes) => {
				if (!mailContainerBlock) {
					return;
				}

				updateBlockAttributes(mailContainerBlock?.clientId, changes);
			};

			return { setMailContainerAttributes };
		}
	)
)(DocumentSettingsBase);

export { DocumentSettings };
