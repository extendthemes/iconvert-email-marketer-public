import { Layout } from '../../components/layout';
import { Button } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { HtmlCodeModal } from './html-code-modal';
import { SendTestMailModal } from './send-test-mail-modal';

import { NewTemplateModal } from './new-template-modal';
import { useEmailTemplateOperations } from './use-email-template-operations';
import {
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	ICONVERTEM_MAIL_POST_METAS,
} from '@iconvertem/constants';
import { getPostDateTimeFormatted } from '@iconvertem/admin-pages/utils';
import { DeleteModal } from './delete-modal';
import { EditTemplateModal } from './edit-template-modal';
import { getBackendData } from '@iconvertem/utils';
import { IcemTable } from '@iconvertem/admin-pages/components';
import { ActionsComponent } from './actions-component';
import { EmptyTableContent } from '@iconvertem/admin-pages/pages/newsletter-emails-page/empty-table-content';
import _ from 'lodash';
import { LoadingTableContent } from '@iconvertem/admin-pages/pages/newsletter-emails-page/loading-table-content';

const NewsletterEmailsPage = () => {
	const {
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

		onShowDeleteModal,
		setShowDeleteModal,
		currentPage,
		setCurrentPage,
		elementsPerPage,
		totalNumberOfTemplates,
		searchString,
		setSearchString,
		showEditSettingsModal,
		setShowEditSettingsModal,
		onShowEditSettingsModal,
		showDeleteModal,
		isResolvingTemplates,
		onRedirectToEditEmailBuilderToolkitPage,
		onGetPreviewLink,
		onRedirectToCreateEmailBuilderToolkitPage,
	} = useEmailTemplateOperations({
		templateTaxonomyType: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.NEWSLETTER,
	});
	const hasTemplates = isResolvingTemplates || !_.isEmpty(emailTemplates);

	const withInternalTools = getBackendData('withInternalTools');
	return (
		<>
			<Layout
				headerActionComponent={headerActionComponent}
				headerTitle={__('Newsletters', 'iconvert-email-marketer')}
				headerDescription={__(
					'Create and manage your newsletter templates',
					'iconvert-email-marketer'
				)}
			>
				{isResolvingTemplates && <LoadingTableContent />}
				{!hasTemplates && <EmptyTableContent />}
				{hasTemplates && !isResolvingTemplates && (
					<>
						<IcemTable className="icem-template-list-table ">
							<IcemTable.Thead>
								<IcemTable.Tr>
									<IcemTable.Th>
										{__(
											'Template Name',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
									<IcemTable.Th>
										{__(
											'Email Subject',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
									{withInternalTools && (
										<IcemTable.Th>
											{__(
												'Save For Clients',
												'iconvert-email-marketer'
											)}
										</IcemTable.Th>
									)}
									<IcemTable.Th>
										{__(
											'Creation Date',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
									<IcemTable.Th>
										{__(
											'Last Modified',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
									<IcemTable.Th>
										{__(
											'Actions',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
								</IcemTable.Tr>
							</IcemTable.Thead>
							<IcemTable.Tbody>
								{emailTemplates.map((item, index) => {
									return (
										<IcemTable.Tr key={index}>
											<IcemTable.Td>
												{item?.title?.rendered ||
													'No name'}
											</IcemTable.Td>
											<IcemTable.Td>
												{
													item?.[
														ICONVERTEM_MAIL_POST_METAS
															.MAIL_SUBJECT
													]
												}
											</IcemTable.Td>
											{withInternalTools && (
												<IcemTable.Td>
													<div
														style={{
															display: 'flex',
															gap: '10px',
														}}
													>
														<Button
															isPrimary
															onClick={() =>
																onRedirectToEditEmailBuilderToolkitPage(
																	item
																)
															}
														>
															{__(
																'Edit code',
																'iconvert-email-marketer'
															)}
														</Button>
														<Button
															isPrimary
															onClick={() =>
																onRedirectToCreateEmailBuilderToolkitPage(
																	item
																)
															}
														>
															{__(
																'Save as Template',
																'iconvert-email-marketer'
															)}
														</Button>
													</div>
												</IcemTable.Td>
											)}
											<IcemTable.Td>
												{getPostDateTimeFormatted(
													item.date_gmt
												)}
											</IcemTable.Td>
											<IcemTable.Td>
												{getPostDateTimeFormatted(
													item.modified_gmt
												)}
											</IcemTable.Td>
											<IcemTable.Td>
												<ActionsComponent
													item={item}
													onEditTemplate={
														onEditTemplate
													}
													onShowEditSettingsModal={
														onShowEditSettingsModal
													}
													onViewTemplate={
														onViewTemplate
													}
													onSendTestEmail={
														onSendTestEmail
													}
													onShowDeleteModal={
														onShowDeleteModal
													}
													onViewHtmlCode={
														onViewHtmlCode
													}
												/>
											</IcemTable.Td>
										</IcemTable.Tr>
									);
								})}
							</IcemTable.Tbody>
						</IcemTable>
						<IcemTable.Pagination
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							elementsPerPage={elementsPerPage}
							totalNumberOfTemplates={totalNumberOfTemplates}
						/>
					</>
				)}
			</Layout>
			{showHtmlCodeModal && (
				<HtmlCodeModal
					onClose={() => setShowHtmlCodeModal(false)}
					post={postUsedForAction}
				/>
			)}
			{showSendTestModal && (
				<SendTestMailModal
					onClose={() => setShowSendTestModal(false)}
					post={postUsedForAction}
				/>
			)}

			{showNewTemplateModal && (
				<NewTemplateModal
					onClose={() => {
						setShowNewTemplateModal(false);
					}}
				/>
			)}
			{showEditSettingsModal && (
				<EditTemplateModal
					post={postUsedForAction}
					onClose={() => {
						setShowEditSettingsModal(false);
					}}
				/>
			)}
			{showDeleteModal && (
				<DeleteModal
					onClose={() => setShowDeleteModal(false)}
					postId={postUsedForAction?.id}
					onDelete={onDelete}
				/>
			)}
		</>
	);
};

export { NewsletterEmailsPage };
