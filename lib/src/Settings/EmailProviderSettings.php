<?php

namespace IconvertEmailMarketer\Settings;

use IconvertEmailMarketer\Core\DataHelper;
use IconvertEmailMarketer\Core\Singleton;

class EmailProviderSettings  extends DataHelper {
	use Singleton;
	protected $settingPath = 'emailProvidersSettings';

	public function getFromName() {
		return $this->getProp('fromName', '');
	}

	public function getFromEmail() {
		return $this->getProp('fromEmail', '');
	}

	public function getSelectedProvider() {
		return $this->getProp('selectedProvider', '');
	}
	public function getSmtpSettings() {
		return $this->getProp('optionsByProvider.smtp', []);
	}

	public function getSendGridApiKey() {
		return $this->getProp('optionsByProvider.sendGrid.apiKey', []);
	}
	public function getMooSendApiKey() {
		return $this->getProp('optionsByProvider.mooSend.apiKey', []);
	}
	public function getMailJetApiKey() {
		return $this->getProp('optionsByProvider.mailJet.apiKey', []);
	}
	public function getMailJetSecretKey() {
		return $this->getProp('optionsByProvider.mailJet.secretKey', []);
	}
	public function getCampaignMonitorApiKey() {
		return $this->getProp('optionsByProvider.campaignMonitor.apiKey', []);
	}
	public function getCampaignMonitorClientId() {
		return $this->getProp('optionsByProvider.campaignMonitor.clientId', []);
	}
}
