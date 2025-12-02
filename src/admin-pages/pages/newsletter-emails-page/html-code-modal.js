import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import { IcemButton, IcemTextarea } from '@iconvertem/admin-pages/components';
import { IcemCopyIcon } from '@iconvertem/admin-pages/icons';

const contentByPostId = {};
const HtmlCodeModal = ({ post, onClose }) => {
	const [content, setContent] = useState(false);
	const isLoadingRef = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const retrieveHtml = async () => {
			const postId = post?.id;
			if (!postId || content) {
				return;
			}
			if (contentByPostId[postId]) {
				setContent(contentByPostId[postId]);
			}
			if (isLoadingRef.current) {
				return;
			}
			isLoadingRef.current = true;
			setIsLoading(true);
			const link = post?.link;
			try {
				const response = await fetch(link);
				const html = await response.text();
				setContent(html);
				contentByPostId[postId] = html;
			} catch (e) {
				console.error(e);
			} finally {
				isLoadingRef.current = false;
				setIsLoading(false);
			}
		};

		retrieveHtml();
	}, []);
	const textAreaRef = useRef();
	const onCopyCode = () => {
		const textAreaControl = textAreaRef.current;
		if (!textAreaControl) {
			return;
		}
		const text = textAreaControl.value;
		window.navigator.clipboard
			.writeText(text)
			.then(() => {
				alert('Copied to clipboard!');
			})
			.catch((err) => {
				console.error('Failed to copy:', err);
			});
	};
	const footerComponent = (
		<>
			{!isLoading && (
				<IcemButton
					onClick={onCopyCode}
					isPrimary
					className={'icem-send-copy-code-button'}
					variant="secondary"
					icon={IcemCopyIcon}
				>
					{__('Copy code', 'iconvert-email-marketer')}
				</IcemButton>
			)}
		</>
	);
	return (
		<IcemModal
			className="iconvertem-copy-html-modal"
			onRequestClose={onClose}
			title={__('HTML code', 'iconvert-email-marketer')}
			footerComponent={footerComponent}
		>
			{isLoading && <Spinner />}
			{!isLoading && (
				<>
					<IcemTextarea
						ref={textAreaRef}
						readOnly
						value={content}
						rows={20}
					/>
				</>
			)}
		</IcemModal>
	);
};

export { HtmlCodeModal };
