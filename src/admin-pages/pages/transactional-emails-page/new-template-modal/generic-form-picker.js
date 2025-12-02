import { BaseControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import _ from 'lodash';
import { IcemSelect } from '@iconvertem/admin-pages/components';
import { EMPTY_SELECT_VALUE } from '@iconvertem/constants';

const GenericFormPicker = ({
	sendingEventFormId,
	setSendingEventFormId,
	getFormsFunc,
	noFormMessage = __('No forms available', 'iconvert-email-marketer'),
	pluginNotInstalledMessage = __(
		'Required plugin is missing',
		'iconvert-email-marketer'
	),
	thirdPartyPluginIsActive = false,
}) => {
	const [formsOptions, setFormsOptions] = useState([]);
	const formsNeedsLoading = _.isEmpty(formsOptions);
	const [formsAreLoading, setFormsAreLoading] = useState(formsNeedsLoading);

	const setWrapperSendingEventFormId = (newValue) => {
		if (newValue === EMPTY_SELECT_VALUE) {
			return;
		}
		setSendingEventFormId(newValue);
	};
	useEffect(() => {
		const fetchData = async () => {
			setFormsAreLoading(true);
			const forms = await getFormsFunc?.();
			if (!_.isEmpty(forms)) {
				const notSelectedPlaceholder = {
					label: __('Select', 'iconvert-email-marketer'),
					value: EMPTY_SELECT_VALUE,
				};
				setFormsOptions([notSelectedPlaceholder].concat(forms));
			}

			setFormsAreLoading(false);
		};

		if (formsNeedsLoading) {
			fetchData();
		}
	}, []);

	const noFormsAvailable = !formsAreLoading && _.isEmpty(formsOptions);

	if (!thirdPartyPluginIsActive) {
		return (
			<BaseControl>
				<BaseControl.VisualLabel className="icem-control-label">
					{__('Select Form', 'iconvert-email-marketer')}
				</BaseControl.VisualLabel>
				<div className="iconvertem-new-template-modal__no-forms-available-notice">
					{pluginNotInstalledMessage}
				</div>
			</BaseControl>
		);
	}
	return (
		<>
			{formsAreLoading && <Spinner />}
			{!formsAreLoading && (
				<>
					{noFormsAvailable && (
						<BaseControl>
							<BaseControl.VisualLabel className="icem-control-label">
								{__('Select Form', 'iconvert-email-marketer')}
							</BaseControl.VisualLabel>
							<div className="iconvertem-new-template-modal__no-forms-available-notice">
								{noFormMessage}
							</div>
						</BaseControl>
					)}
					{!noFormsAvailable && (
						<IcemSelect
							label={__('Select Form', 'iconvert-email-marketer')}
							value={sendingEventFormId}
							onChange={setWrapperSendingEventFormId}
							options={formsOptions}
						/>
					)}
				</>
			)}
		</>
	);
};

export { GenericFormPicker };
