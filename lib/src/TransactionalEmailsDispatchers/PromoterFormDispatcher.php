<?php

namespace IconvertEmailMarketer\TransactionalEmailsDispatchers;



use IconvertEmailMarketer\App\Core\Structure\TemplateTags\PromoterTemplateTags;
use IconvertEmailMarketer\Core\LodashBasic;
use IconvertEmailMarketer\Core\Singleton;
use IconvertEmailMarketer\EmailTypes\TransactionalEmail;

class PromoterFormDispatcher extends BaseFormDispatcher{
	use Singleton;

	const EVENT_TYPE = 'afterPromoterSubmitFormSubmission';

	protected function __construct() {
		parent::__construct();
		add_action('iconvertpr_popup_subscribe_user', array($this, 'onSubscribed'));
	}



	public function onSubscribed($user_email) {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$form_id = intval( sanitize_text_field(LodashBasic::get($_POST, 'fields.popupID', 0)));



		if(empty($form_id) && $form_id !== 0) {
			return;
		}
		$mailTemplatePost = $this->getTemplatesLinkedToFormId($form_id);
		if(empty($mailTemplatePost) || (!$mailTemplatePost instanceof \WP_Post)) {
			return;
		}
		$form_data = [
			'email' => $user_email,
		];
		PromoterTemplateTags::storeContactFormCurrentEmailData($form_data);
		$mailObj = new TransactionalEmail($mailTemplatePost);

		$mailObj->sendEmail($user_email);
	}
}
