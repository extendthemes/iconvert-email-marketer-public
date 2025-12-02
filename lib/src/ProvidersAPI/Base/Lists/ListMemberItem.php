<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base\Lists;

use IconvertEmailMarketer\ProvidersAPI\Base\ClassToJsonSerializableBase;


/**
 * The normalized version of lists across all providers
 * Should contain minimum viable options that are common across providers
 * Each provider implementation should convert it from/to their specific format
 *
 * Class ListMemberItem
 * @package IConvert\Base\Lists
 *
 */
class ListMemberItem extends ClassToJsonSerializableBase {

	/**
	 * @var string Subscriber email address
	 */
	public $email_address = '';

	/**
	 * @var string Subscriber status
	 */
	public $status = 'subscribed';

	/**
	 * @var string Subscriber name
	 */
	public $name = '';

	/**
	 * @var string Subscriber id
	 */
	public $id = '';

	/**
	 * @var string Subscriber custom fields
	 */
	public $custom_fields = array();

	/**
	 * ListMemberItem constructor.
	 * @param array $data
	 * @param array $mappings
	 */
	public function __construct( $data = array(), $mappings = array() ) {
		parent::__construct( $data, $mappings );
	}
}
