<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base;

class Features {

	const getLists   = 'getLists';
	const getList    = 'getList';
	const createList = 'createList';
	const updateList = 'updateList';
	const deleteList = 'deleteList';

	const getListMembers   = 'getListMembers';
	const addListMember    = 'addListMember';
	const updateListMember = 'updateListMember';
	const deleteListMember = 'deleteListMember';

	const getCampaigns       = 'getCampaigns';
	const getCampaign        = 'getCampaign';
	const createCampaign     = 'createCampaign';
	const updateCampaign     = 'updateCampaign';
	const deleteCampaign     = 'deleteCampaign';
	const sendCampaign       = 'sendCampaign';
	const getCampaignReports = 'getCampaignReports';

	const getCustomFields                = 'getCustomFields';
	const getCustomField                 = 'getCustomField';
	const addCustomField                 = 'addCustomField';
	const updateCustomField              = 'updateCustomField';
	const deleteCustomField              = 'deleteCustomField';
	const sendTransactionalFromPHPMailer = 'sendTransactionalFromPHPMailer';
}
