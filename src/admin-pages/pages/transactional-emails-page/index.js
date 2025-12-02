import { Layout } from '../../components/layout';
import { Button } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { SendTestMailModal } from '../newsletter-emails-page/send-test-mail-modal';

import { NewTemplateModal } from './new-template-modal';
import { useEmailTemplateOperations } from '../newsletter-emails-page/use-email-template-operations';
import {
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	ICONVERTEM_MAIL_POST_METAS,
} from '@iconvertem/constants';
import {
	getPostDateTimeFormatted,
	getSendingEventLabel,
} from '@iconvertem/admin-pages/utils';
import { DeleteModal } from '../newsletter-emails-page/delete-modal';
import { TemplateStatusControl } from './template-status-control';
import { EditTemplateModal } from './edit-template-modal';
import { getBackendData } from '@iconvertem/utils';
import { IcemTable } from '@iconvertem/admin-pages/components/icem-table';
import { ActionsComponent } from '@iconvertem/admin-pages/pages/transactional-emails-page/actions-component';
import _ from 'lodash';
import { LoadingTableContent } from '@iconvertem/admin-pages/pages/newsletter-emails-page/loading-table-content';
import { EmptyTableContent } from '@iconvertem/admin-pages/pages/newsletter-emails-page/empty-table-content';

const TransactionalEmailsPage = () => {
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
		showDeleteModal,
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
		isResolvingTemplates,
		onGetPreviewLink,

		onShowEditSettingsModal,
		onRedirectToEditEmailBuilderToolkitPage,
		onRedirectToCreateEmailBuilderToolkitPage,
	} = useEmailTemplateOperations({
		templateTaxonomyType: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.TRANSACTIONAL,
	});
	const hasTemplates = isResolvingTemplates || !_.isEmpty(emailTemplates);
	const withInternalTools = getBackendData('withInternalTools');
	return (
		<>
			<Layout
				headerActionComponent={headerActionComponent}
				headerTitle={__(
					'Transactional Emails',
					'iconvert-email-marketer'
				)}
				headerDescription={__(
					'Manage your transactional email templates',
					'iconvert-email-marketer'
				)}
			>
				{isResolvingTemplates && <LoadingTableContent />}
				{!hasTemplates && <EmptyTableContent />}
				{hasTemplates && !isResolvingTemplates && (
					<>
						<IcemTable className="icem-template-list-table icem-template-list-table__transactional">
							<IcemTable.Thead>
								<IcemTable.Tr>
									<IcemTable.Th>
										{__(
											'Active',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
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
											'Sending Event',
											'iconvert-email-marketer'
										)}
									</IcemTable.Th>
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
											<IcemTable.Td
												style={{ width: '60px' }}
											>
												<TemplateStatusControl
													post={item}
												/>
											</IcemTable.Td>
											<IcemTable.Td>
												{item?.title?.rendered ||
													'No name'}
											</IcemTable.Td>
											{withInternalTools && (
												<IcemTable.Td>
													<div className="icem-template-list-table__actions">
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
												{
													item?.[
														ICONVERTEM_MAIL_POST_METAS
															.MAIL_SUBJECT
													]
												}
											</IcemTable.Td>
											<IcemTable.Td>
												{getSendingEventLabel(
													item?.[
														ICONVERTEM_MAIL_POST_METAS
															.SENDING_EVENT_TYPE
													]
												)}
											</IcemTable.Td>
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

export { TransactionalEmailsPage };
