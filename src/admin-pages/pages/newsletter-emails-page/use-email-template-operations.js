import { useDispatch, useSelect } from '@wordpress/data';
import {
	ICONVERTEM_EMAIL_TAXONOMIES_ID_BY_TYPE,
	ICONVERTEM_TAXONOMY_SLUG,
	ICONVERTEM_TEMPLATE_ENTITY_TYPE,
} from '@iconvertem/constants';
import { redirectToEditorPage } from '@iconvertem/admin-pages/utils';
import { useMemo, useState } from '@wordpress/element';
import { getBackendData } from '@iconvertem/utils';
import { SearchAndAddComponent } from '@iconvertem/admin-pages/pages/newsletter-emails-page/search-and-add-component';

const elementsPerPage = 10;

const useEmailTemplateOperations = ({ templateTaxonomyType }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [searchString, setSearchString] = useState('');
	const [showHtmlCodeModal, setShowHtmlCodeModal] = useState(false);
	const [showEditSettingsModal, setShowEditSettingsModal] = useState(false);
	const [postUsedForAction, setPostUsedForAction] = useState();
	const [showSendTestModal, setShowSendTestModal] = useState(false);
	const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
	const { deleteEntityRecord } = useDispatch('core');
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const { emailTemplatesRaw, isResolvingTemplates } = useSelect((select) => {
		const { getEntityRecords, hasFinishedResolution } = select('core');

		const args = {
			per_page: -1,
		};
		const termId =
			ICONVERTEM_EMAIL_TAXONOMIES_ID_BY_TYPE[templateTaxonomyType];
		if (termId) {
			args[ICONVERTEM_TAXONOMY_SLUG] = termId;
		}
		const emailTemplatesRaw = getEntityRecords(
			'postType',
			ICONVERTEM_TEMPLATE_ENTITY_TYPE,
			args
		);
		const hasFinishedResolutionResult = hasFinishedResolution(
			'getEntityRecords',
			['postType', ICONVERTEM_TEMPLATE_ENTITY_TYPE, args]
		);
		return {
			isResolvingTemplates: !hasFinishedResolutionResult,
			emailTemplatesRaw: emailTemplatesRaw || [],
		};
	}, []);
	const filteredRawTemplates = useMemo(() => {
		if (!searchString) {
			return emailTemplatesRaw;
		}
		return emailTemplatesRaw.filter((item) =>
			item?.title?.raw?.toLowerCase?.()?.includes?.(searchString)
		);
	}, [emailTemplatesRaw, searchString]);
	const totalNumberOfTemplates = filteredRawTemplates?.length || 0;
	const emailTemplates = useMemo(() => {
		const initialIndex = currentPage * elementsPerPage;
		const items = filteredRawTemplates.slice(
			initialIndex,
			initialIndex + elementsPerPage
		);

		return items;
	}, [filteredRawTemplates, currentPage]);

	const onAddNewTemplate = () => {
		setShowNewTemplateModal(true);
	};

	const onEditTemplate = (id) => {
		redirectToEditorPage(id);
	};

	const onViewTemplate = (post) => {
		const link = post?.link;
		if (!link) {
			return;
		}
		window.location = post?.link;
	};

	const onViewHtmlCode = (post) => {
		setPostUsedForAction(post);
		setShowHtmlCodeModal(true);
	};

	const onSendTestEmail = (post) => {
		setPostUsedForAction(post);
		setShowSendTestModal(true);
	};

	const onShowDeleteModal = (post) => {
		setPostUsedForAction(post);
		setShowDeleteModal(true);
	};

	const onShowEditSettingsModal = (post) => {
		setPostUsedForAction(post);
		setShowEditSettingsModal(true);
	};

	const onRedirectToCreateEmailBuilderToolkitPage = (post) => {
		const adminPage = getBackendData('admin_url');

		window.location = `${adminPage}/admin.php?page=ptk&route=templates.import&post_id=${post?.id}}`;
	};

	const onRedirectToEditEmailBuilderToolkitPage = (post) => {
		const adminPage = getBackendData('admin_url');
		window.location = `${adminPage}/admin.php?page=ptk&route=templates.code&post_id=${post?.id}}`;
	};

	const onDelete = (id) => {
		if (id) {
			deleteEntityRecord('postType', ICONVERTEM_TEMPLATE_ENTITY_TYPE, id);
		}

		setShowDeleteModal(false);
	};
	const headerActionComponent = (
		<SearchAndAddComponent
			searchString={searchString}
			setSearchString={setSearchString}
			addButtonAction={onAddNewTemplate}
		/>
	);

	return {
		emailTemplates,
		onSendTestEmail,
		onDelete,
		onViewTemplate,
		onEditTemplate,
		onViewHtmlCode,
		showHtmlCodeModal,
		headerActionComponent,
		postUsedForAction,
		showNewTemplateModal,
		showSendTestModal,
		setShowNewTemplateModal,
		setShowHtmlCodeModal,
		setShowSendTestModal,
		showDeleteModal,
		onShowDeleteModal,
		setShowDeleteModal,
		isResolvingTemplates,

		emailTemplatesRaw,

		currentPage,
		setCurrentPage,
		elementsPerPage,
		totalNumberOfTemplates,
		searchString,
		setSearchString,
		showEditSettingsModal,
		onShowEditSettingsModal,
		setShowEditSettingsModal,
		setPostUsedForAction,

		onRedirectToEditEmailBuilderToolkitPage,
		onRedirectToCreateEmailBuilderToolkitPage,
	};
};

export { useEmailTemplateOperations };
