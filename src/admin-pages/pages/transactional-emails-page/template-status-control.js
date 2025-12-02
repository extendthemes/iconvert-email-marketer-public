import { useState } from '@wordpress/element';
import {
	ICONVERTEM_MAIL_POST_METAS,
	ICONVERTEM_TEMPLATE_ENTITY_TYPE,
} from '@iconvertem/constants';
import { useDispatch } from '@wordpress/data';
import { IcemToggleControl } from '@iconvertem/admin-pages/components/icem-toggle-control';

const TemplateStatusControl = ({ post }) => {
	const defaultValue = post?.[ICONVERTEM_MAIL_POST_METAS.DISABLED] != '1';
	const [isEnabled, setInternalIsEnabled] = useState(defaultValue);

	const { editEntityRecord, saveEditedEntityRecord } = useDispatch('core');
	const onChangeEntityValue = async (newValue) => {
		const postId = post?.id;
		if (!postId) {
			return;
		}
		const newValueForPost = newValue ? '0' : '1';

		const postChanges = {
			[ICONVERTEM_MAIL_POST_METAS.DISABLED]: newValueForPost,
		};

		await editEntityRecord(
			'postType',
			ICONVERTEM_TEMPLATE_ENTITY_TYPE,
			postId,
			postChanges
		);
		saveEditedEntityRecord(
			'postType',
			ICONVERTEM_TEMPLATE_ENTITY_TYPE,
			postId
		);
	};
	const onChange = (newValue) => {
		setInternalIsEnabled(newValue);
		onChangeEntityValue(newValue);
	};
	return (
		<>
			<IcemToggleControl value={isEnabled} onChange={onChange} />
		</>
	);
};

export { TemplateStatusControl };
