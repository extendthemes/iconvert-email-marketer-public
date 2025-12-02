<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base\Lists;

use IconvertEmailMarketer\ProvidersAPI\Base\ClassToJsonSerializableBase;


/**
 * The normalized version of a custom across all providers
 * Should contain minimum viable options that are common across providers
 * Each provider implementation should convert it from/to their specific format
 *
 * Class CustomFieldItem
 * @package IConvert\Base\Lists
 */
class CustomFieldItem extends ClassToJsonSerializableBase {


	/**
	 * @var string Custom field id
	 */
	public $id = '';

	/**
	 * @var string Custom field tag
	 */
	public $tag = '';

	/**
	 * @var string Custom field name
	 */
	public $name = '';

	/**
	 * @var string Custom field type
	 */
	public $type = '';

	/**
	 * @var string Custom field is public
	 */
	public $public = '';
}
