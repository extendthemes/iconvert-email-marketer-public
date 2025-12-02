<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base\Lists;

use IconvertEmailMarketer\ProvidersAPI\Base\QueryBase;

class ListMembersQuery extends QueryBase {

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
	 * @var String The subscriber status
	 */
	public $status = 'subscribed';
}
