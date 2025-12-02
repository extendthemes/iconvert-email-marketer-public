<?php

namespace IconvertEmailMarketer\ProvidersAPI;



use IconvertEmailMarketer\ProvidersAPI\Base\Config;
use IconvertEmailMarketer\ProvidersAPI\Base\ApiException;
use IconvertEmailMarketer\ProvidersAPI\Base\EmailProviderBase;
use IconvertEmailMarketer\ProvidersAPI\Providers\CampaignMonitor\CampaignMonitor;
use IconvertEmailMarketer\ProvidersAPI\Providers\MailJet\MailJet;
use IconvertEmailMarketer\ProvidersAPI\Providers\SendGrid\SendGrid;

class Api {

	const PROVIDERS_CLASSES = array(
		EmailProviders::CAMPAIGN_MONITOR => CampaignMonitor::class,
		EmailProviders::MAIL_JET         => MailJet::class,
		EmailProviders::SEND_GRID        => SendGrid::class,
	);

	/**
	 * @var string
	 */
	private $providerName = '';

	/**
	 * @var Config $providerConfig
	 */
	private $providerConfig = null;


	/**
	 * @var EmailProviderBase $providerInstance
	 */

	private $providerInstance;

	/**
	 * Api constructor.
	 * @param $providerName
	 * @param Config $providerConfig
	 */
	public function __construct( $providerName, Config $providerConfig ) {

		$this->setProvider( $providerName, $providerConfig );
	}

	/**
	 * @return EmailProviderBase
	 */
	public function getProviderClient() {
		return $this->providerInstance;
	}

	/**
	 * @param $providerName
	 * @param Config $providerConfig
	 */
	public function setProvider( $providerName, Config $providerConfig ) {
		$this->providerName   = $providerName;
		$this->providerConfig = $providerConfig;
		$providerClass        = self::PROVIDERS_CLASSES[ $providerName ];
		if ( class_exists( $providerClass ) ) {
			$this->providerInstance = new $providerClass( $providerConfig );
		} else {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
			throw new ApiException( "$providerName provider not supported" );
		}
	}
}
