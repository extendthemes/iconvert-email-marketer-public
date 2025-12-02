/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function SaveButton() {
	const { isDirty, dirtyEntities, isSaving } = useSelect((select) => {
		const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } =
			select('core');
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		const hasDirtyEntities = dirtyEntityRecords.length > 0;
		return {
			dirtyEntities: dirtyEntityRecords,
			isDirty: hasDirtyEntities,
			isSaving: !hasDirtyEntities
				? false
				: dirtyEntityRecords?.reduce(
						(acc, { kind, name, key }) =>
							acc || isSavingEntityRecord(kind, name, key),
						false
				  ),
		};
	}, []);

	const { saveEditedEntityRecord } = useDispatch('core');

	const save = useCallback(() => {
		dirtyEntities.forEach(({ kind, name, key }) => {
			saveEditedEntityRecord(kind, name, key, {
				throwOnError: true,
			});
		});
	}, [dirtyEntities]);

	const disabled = !isDirty;

	return (
		<Button
			className="edit-navigation-toolbar__save-button"
			variant="primary"
			onClick={save}
			isBusy={isSaving}
			disabled={disabled}
		>
			{isSaving ? __('Saving…') : __('Save')}
		</Button>
	);
}
