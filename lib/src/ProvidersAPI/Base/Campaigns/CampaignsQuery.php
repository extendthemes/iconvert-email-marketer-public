<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base\Campaigns;

use IconvertEmailMarketer\ProvidersAPI\Base\QueryBase;

/**
 *
 * Class CampaignsQuery
 * @package IConvert\Base\Campaigns
 */
class CampaignsQuery extends QueryBase {

	/**
	 *
	 * @var Mixed The custom fields
	 */
	public $fields = null;

	/**
	 *
	 * @var Mixed The custom fields to be excluded
	 */
	public $exclude_fields = null;

	/**
	 *
	 * @var int The number of records
	 */
	public $count = 10;

	/**
	 *
	 * @var int The offset number used for pagination
	 */
	public $offset = 0;

	/**
	 *
	 * @var mixed The campaign type
	 */
	public $type = null;

	/**
	 *
	 * @var int The status (canceled/scheduled/draft/sent)
	 */
	public $status = null;


	/**
	 *
	 * @var DateTime Campaigns sent before a date
	 */
	public $before_send_time = null;

	/**
	 *
	 * @var DateTime Campaigns sent after a date
	 */
	public $since_send_time = null;

	/**
	 *
	 * @var DateTime Campaigns created before a date
	 */
	public $before_create_time = null;

	/**
	 *
	 * @var DateTime Campaigns created after a date
	 */
	public $since_create_time = null;

	/**
	 *
	 * @var mixed The list ID for the campaign
	 */
	public $list_id = null;

	/**
	 *
	 * @var DateTime Folder ID for the list
	 */
	public $folder_id = null;

	/**
	 *
	 * @var DateTime Member ID
	 */
	public $member_id = null;

	/**
	 *
	 * @var String The sorting field name
	 */
	public $sort_field = null;

	/**
	 *
	 * @var String The sort direction (asc|desc)
	 */
	public $sort_dir = null;
}
