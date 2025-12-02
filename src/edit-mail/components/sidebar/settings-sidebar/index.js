/**
 * WordPress dependencies
 */
import {
	BlockInspector,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { Platform } from "@wordpress/element";
import { cog } from "@wordpress/icons";
import { store as interfaceStore } from "@wordpress/interface";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";

/**
 * Internal dependencies
 */
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as editPostStore } from "../../../store";
import PluginSidebarEditPost from "../plugin-sidebar";
import SettingsHeader from "../settings-header";
import { DocumentSettings } from "../document-settings";

const SIDEBAR_ACTIVE_BY_DEFAULT = Platform.select({
	web: true,
	native: false,
});

const SettingsSidebar = () => {
	const { sidebarName, keyboardShortcut } = useSelect((select) => {
		// The settings sidebar is used by the edit-post/document and edit-post/block sidebars.
		// sidebarName represents the sidebar that is active or that should be active when the SettingsSidebar toggle button is pressed.
		// If one of the two sidebars is active the component will contain the content of that sidebar.
		// When neither of the the two sidebars is active we can not simply return null, because the PluginSidebarEditPost
		// component, besides being used to render the sidebar, also renders the toggle button. In that case sidebarName
		// should contain the sidebar that will be active when the toggle button is pressed. If a block
		// is selected, that should be edit-post/block otherwise it's edit-post/document.
		let sidebar = select(interfaceStore).getActiveComplementaryArea(
			editPostStore.name
		);
		if (!["edit-post/document", "edit-post/block"].includes(sidebar)) {
			if (select(blockEditorStore).getBlockSelectionStart()) {
				sidebar = "edit-post/block";
			}
			sidebar = "edit-post/document";
		}
		const shortcut = select(keyboardShortcutsStore).getShortcutRepresentation(
			"ic/edit-mail/toggle-sidebar"
		);
		return {
			sidebarName: sidebar,
			keyboardShortcut: shortcut,
		};
	}, []);

	return (
		<PluginSidebarEditPost
			identifier={sidebarName}
			header={<SettingsHeader sidebarName={sidebarName} />}
			closeLabel={__("Close settings")}
			headerClassName="edit-post-sidebar__panel-tabs"
			/* translators: button label text should, if possible, be under 16 characters. */
			title={__("Settings")}
			toggleShortcut={keyboardShortcut}
			icon={cog}
			isActiveByDefault={SIDEBAR_ACTIVE_BY_DEFAULT}
		>
			{sidebarName === "edit-post/document" && <DocumentSettings />}
			{sidebarName === "edit-post/block" && <BlockInspector />}
		</PluginSidebarEditPost>
	);
};

export default SettingsSidebar;
