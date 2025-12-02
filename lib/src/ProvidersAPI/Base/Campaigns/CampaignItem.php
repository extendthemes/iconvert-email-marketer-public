<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base\Campaigns;

use IconvertEmailMarketer\ProvidersAPI\Base\ClassToJsonSerializableBase;

/**
 * The normalized version of campaigns across all providers
 * Should contain minimum viable options that are common across providers
 * Each provider implementation should convert it from/to their specific format
 *
 * Class CampaignItem
 * @package IConvert\Base\Campaigns
 *
 */
class CampaignItem extends ClassToJsonSerializableBase {


	/**
	 * @var string The id of the campaign
	 */
	public $id = '';

	/**
	 * @var string The type of the campaign
	 */
	public $type = 'regular';

	/**
	 * @var string The name of the campaign
	 */
	public $name = '';

	/**
	 * @var string The subject line of the email to be send
	 */
	public $subject_line = '';

	/**
	 * @var string The template of the "from name" that will be added into the send emails
	 */
	public $from_name = '';

	/**
	 * @var string The email adress that should be used as "from email"
	 */
	public $from_email = '';

	/**
	 * @var string The template of the "to name" that will be added into the send emails
	 */
	public $to_name = '';

	/**
	 * @var string The reply to email address of the campaign
	 */
	public $reply_to = '';

	public $html_content = '';

	/**
	 * @var string The list id to which the campaign should be send
	 */
	public $list_id = '';

	/**
	 * @var string Campaign status
	 */
	public $status = '';

	/**
	 * @var string Campaign email content
	 */
	public $content = '';
}
