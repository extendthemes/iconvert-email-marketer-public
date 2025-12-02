<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base\Campaigns;

use IconvertEmailMarketer\ProvidersAPI\Base\ClassToJsonSerializableBase;

/**
 * The normalized version of the campaign report data that should be
 * returned by each provider implementation
 * Class CampaignReport
 * @package IConvert\Base\Campaigns
 */
class CampaignReport extends ClassToJsonSerializableBase {

	/**
	 * @var int The number of send emails in a campaign
	 */
	public $emails_sent = 0;

	/**
	 * @var int The number of total opened emails in a campaign
	 */
	public $opens_total = 0;

	/**
	 * @var int The number of total unique opened emails in a campaign
	 */
	public $unique_opens = 0;

	/**
	 * @var int The percentage of opened emails in a campaign
	 */
	public $open_rate = 0;

	/**
	 * @var int The total number of click actions in a campaign
	 */
	public $clicks_total = 0;

	/**
	 * @var int The total number of boucnes in a campaign
	 */
	public $hard_bounces = 0;
}
