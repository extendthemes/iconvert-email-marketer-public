import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { getBackendData } from '@iconvertem/utils';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import { IcemButton, IcemTextarea } from '@iconvertem/admin-pages/components';
import { IcemSendIcon } from '@iconvertem/admin-pages/icons';

const SendTestMailModal = ({ post, onClose }) => {
	const [recipients, setRecipients] = useState(
		getBackendData('current_user_email')
	);
	const [responseStatus, setResponseStatus] = useState({
		type: null,
		message: '',
	});
	const isSendingRef = useRef(false);
	const onSendEmail = async () => {
		if (!post?.id) {
			return;
		}
		if (isSendingRef.current) {
			return;
		}

		isSendingRef.current = true;
		const data = {
			mails: recipients,
			'template-id': post?.id,
		};
		try {
			const res = await apiFetch({
				path: addQueryArgs(
					'iconvertem/v1/send-test-email-for-template'
				),
				method: 'POST',
				data,
			});
			isSendingRef.current = false;
			setResponseStatus({
				type: 'success',
				message: __('Sent successfully', 'iconvert-email-marketer'),
			});
		} catch (e) {
			console.error(e);
			isSendingRef.current = false;
			setResponseStatus({
				type: 'error',
				message: __(
					'There was an error on send',
					'iconvert-email-marketer'
				),
			});
		}
	};

	const footerComponent = (
		<>
			<IcemButton
				className={'icem-send-test-email-button'}
				onClick={onSendEmail}
				isPrimary
				icon={IcemSendIcon}
				variant="secondary"
				disabled={!recipients}
			>
				{__('Send Test Email', 'iconvert-email-marketer')}
			</IcemButton>
		</>
	);

	return (
		<IcemModal
			onRequestClose={onClose}
			footerComponent={footerComponent}
			title={__('Send test mail', 'iconvert-email-marketer')}
		>
			<IcemTextarea
				value={recipients}
				onChange={setRecipients}
				label={__('Email address(es)*', 'iconvert-email-marketer')}
			/>
			<p className="icem-send-test-email-modal__email-description">
				{__('*One email address per line', 'iconvert-email-marketer')}
			</p>
			<p
				style={{
					color:
						responseStatus?.type === 'success'
							? 'green'
							: responseStatus?.type === 'error'
							? 'red'
							: 'black',
				}}
			>
				{responseStatus.message}
			</p>
		</IcemModal>
	);
};

export { SendTestMailModal };
