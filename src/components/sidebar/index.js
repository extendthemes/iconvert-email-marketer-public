/**
 * WordPress dependencies
 */
import { createSlotFill, Panel, PanelBody, Button  } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'StandAloneBlockEditorSidebarInspector'
);

import { useRichTextContext } from '../context';

function Sidebar() {
	const {
		saveRichTextContent,
		canSaveToServer,
		saveContentAsTemplate
	} = useRichTextContext();

	const [disabled, updateDisabled] = useState(true);
	const [disabledTemplate, updateTemplateDisabled] = useState(false);


	useEffect(() => {
		updateDisabled(!canSaveToServer);
		updateTemplateDisabled(!canSaveToServer);
	}, [canSaveToServer])

	return (
		<div
			className="cs_promorictext-sidebar"
			role="region"
			aria-label={ __( 'Standalone Block Editor advanced settings.' ) }
			tabIndex="-1"
		>
			<Panel>
				<PanelBody>
					<Button
						isPrimary
						disabled={disabled}
						onClick={saveRichTextContent}
					>Save</Button>
					<Button
						style={{ marginLeft: '50px'}}
						isSecondary
						disabled={disabledTemplate}
						onClick={saveContentAsTemplate}
					>Save as template</Button>
				</PanelBody>
			</Panel>

			<Panel header={ __( 'Inspector' ) }>
				<InspectorSlot bubblesVirtually />
			</Panel>
		</div>
	);
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
