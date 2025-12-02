<?php

namespace  IconvertEmailMarketer\App\Core\Structure;


use IconvertEmailMarketer\ProvidersAPI\Api;
use IconvertEmailMarketer\ProvidersAPI\Base\Config;

class CustomMailer extends \WP_PHPMailer {


	private $provider;
	private $provider_settings;


	public function __construct( $exceptions = false, $provider, $provider_settings ) {
		parent::__construct( $exceptions );

		$this->provider          = $provider;
		$this->provider_settings = $provider_settings;
	}

	public function postSend() {

		$server    = '';
		$client_id = '';
		$api_key   = '';

		switch ( $this->provider ) {
			case 'campaign-monitor':
				$api_key   = $this->provider_settings['api_key'] ?? '';
				$client_id = $this->provider_settings['client_id'] ?? '';
				break;
			case 'mail-jet':
				$api_key   = $this->provider_settings['secret_key'] ?? '';
				$client_id = $this->provider_settings['api_key'] ?? '';
				break;
			case 'send-grid':
				$api_key = $this->provider_settings['api_key'] ?? '';
				break;
			default:
				$api_key = $this->provider_settings['api_key'] ?? '';
		}


		try {
			$provider_instance = new Api(
				$this->provider,
				new Config(
					$api_key,
					$server,
					$client_id
				)
			);

			$provider_client = $provider_instance->getProviderClient();

			return $provider_client->sendTransactionalEmailFromPHPMailer(
				$this
			);

		} catch ( \Exception $exc ) {

			$this->setError( $exc->getMessage() );
			$this->edebug( $exc->getMessage() );


			//need to decide if we allow this as it crashes if email is not configured ok
			if ( $this->exceptions ) {
				throw $exc;
			}

			return false;
		}

		return true;

	}
}
