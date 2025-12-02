<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base\Lists;

use IconvertEmailMarketer\ProvidersAPI\Base\ClassToJsonSerializableBase;


/**
 * Class ListItem
 * @package IConvert\Base\Lists
 *
 * The normalized version of lists across all providers
 * Should contain minimum viable options that are common across providers
 * Each provider implementation should convert it from/to their specific format
 */
class ListItem extends ClassToJsonSerializableBase {

	/**
	 * @var string List name
	 */
	public $name = '';

	/**
	 * @var string List id
	 */
	public $id = '';
}

