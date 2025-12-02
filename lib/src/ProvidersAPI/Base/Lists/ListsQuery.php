<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base\Lists;

use IconvertEmailMarketer\ProvidersAPI\Base\QueryBase;

class ListsQuery extends QueryBase {

	/**
	 *
	 * @var mixed The custom fields
	 */
	public $fields = null;

	/**
	 *
	 * @var mixed The custom fields to be excluded
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
	 * @var DateTime Lists created before a date
	 */
	public $before_date_created = null;

	/**
	 *
	 * @var DateTime Lists created after a date
	 */
	public $since_date_created = null;

	/**
	 *
	 * @var DateTime Lists created before a date a campaign was sent
	 */
	public $before_campaign_last_sent = null;

	/**
	 *
	 * @var DateTime Lists created after a date a campaign was sent
	 */
	public $since_campaign_last_sent = null;


	public $email = null;

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

	/**
	 *
	 * @var Boolean Lists with a store
	 */
	public $has_ecommerce_store = null;

	//SendinBlue params
	public $limit = 10;

	/**
	 *
	 * @var String The sort direction (asc|desc)
	 */
	public $sort = 'desc';

	/**
	 *
	 * @var mixed The List type
	 */
	public $type = 'broadcast';
}
