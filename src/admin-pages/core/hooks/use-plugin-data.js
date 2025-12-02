import { useDispatch, useSelect } from '@wordpress/data';
import {
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { useIconvertemNotices } from '../notices';
import { convertObjectsToArrays } from '@iconvertem/utils';
import { ICONVERTEM_DATA_HELPER_POST_TYPE } from '@iconvertem/constants';

const PluginDataContext = createContext({
	value: {},
	onChange: _.noop,
});

const pluginDataPostType = ICONVERTEM_DATA_HELPER_POST_TYPE;

const PluginDataContextWrapper = memo(({ children }) => {
	const [localPluginData, setLocalPluginData] = useState({});
	const [isSaving, setIsSaving] = useState(false);

	const { pluginDataEntity, pluginDataHasChanges } = useSelect((select) => {
		const {
			getEntityRecords,
			getEditedEntityRecord,
			getEntityRecordEdits,
		} = select('core');

		const entityRecords =
			getEntityRecords('postType', pluginDataPostType) || [];
		const entityRecord = _.get(entityRecords, 0);
		if (!entityRecord) {
			return {};
		}
		const pluginDataEntity = getEditedEntityRecord(
			'postType',
			pluginDataPostType,
			entityRecord.id
		);

		const pluginDataHasChanges = getEntityRecordEdits(
			'postType',
			pluginDataPostType,
			pluginDataEntity?.id
		);

		return {
			pluginDataEntity,
			pluginDataHasChanges: !_.isEmpty(pluginDataHasChanges)
				? true
				: false,
		};
	}, []);

	const { saveEditedEntityRecord, editEntityRecord } = useDispatch('core');

	const { createSuccessLeadGreetNotice, createErrorLeadGreetNotice } =
		useIconvertemNotices();

	const pluginData = useMemo(() => {
		try {
			const content = _.get(pluginDataEntity, 'content', '{}');
			const parsedContent = JSON.parse(content);
			const fixedParsedContent = convertObjectsToArrays(parsedContent);
			return fixedParsedContent;
		} catch (e) {
			return {};
		}
	}, [pluginDataEntity]);

	useEffect(() => {
		if (!_.isEqual(pluginData, localPluginData)) {
			setLocalPluginData(pluginData);
		}
	}, [pluginData]);

	const isPendingRef = useRef(false);
	const onChange = useCallback(
		async (newContent, options = {}) => {
			if (isPendingRef.current) {
				return;
			}
			isPendingRef.current = true;

			const entity = pluginDataEntity;

			if (!entity?.id) {
				isPendingRef.current = false;
				return;
			}

			const newContentClone = _.cloneDeep(newContent);
			setLocalPluginData(newContentClone);

			const newContentAsString = JSON.stringify(newContentClone);

			const record = {
				content: newContentAsString,
			};

			editEntityRecord(
				'postType',
				pluginDataPostType,
				entity?.id,
				record
			);

			if (options?.withSave) {
				onSave({ shouldNotify: options?.shouldNotify });
			}

			isPendingRef.current = false;
		},
		[isPendingRef, pluginDataEntity, pluginData, setLocalPluginData]
	);

	const onSave = useCallback(
		async ({ shouldNotify } = { shouldNotify: false }) => {
			setIsSaving(true);

			const updatedRecord = await saveEditedEntityRecord(
				'postType',
				pluginDataPostType,
				pluginDataEntity?.id
			);

			if (shouldNotify) {
				if (updatedRecord) {
					createSuccessLeadGreetNotice(
						__(
							'Changes have been saved successfully!',
							'iconvert-email-marketer'
						)
					);
				} else {
					createErrorLeadGreetNotice(
						__(
							'Changes have not been saved! A server error occurred.',
							'iconvert-email-marketer'
						)
					);
				}
			}

			setIsSaving(false);
		},
		[pluginDataEntity, saveEditedEntityRecord, setIsSaving]
	);
	const usePathData = useCallback(
		(path) => {
			return {
				value: _.get(pluginData, path),
				onChange: (newValue) => {
					const changes = _.set({}, path, newValue);
					const newObjs = _.merge({}, pluginData, changes);
					onChange(newObjs);
				},
			};
		},
		[pluginData, onChange]
	);
	const contextValue = useMemo(() => {
		return {
			isReady: !!pluginDataEntity,
			pluginData,
			onChangePluginData: onChange,
			onSave,
			isSaving,
			pluginDataHasChanges,
			usePathData,
		};
	}, [
		pluginData,
		onChange,
		onSave,
		isSaving,
		pluginDataHasChanges,
		usePathData,
	]);

	return (
		<PluginDataContext.Provider value={contextValue}>
			{children}
		</PluginDataContext.Provider>
	);
});

const usePluginData = () => {
	return useContext(PluginDataContext);
};

export { usePluginData, PluginDataContextWrapper };
