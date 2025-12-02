<?php

namespace  IconvertEmailMarketer\App\Core\Frontend;

use  IconvertEmailMarketer\App\Core\Admin\Actions\EditorActions;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateCPT;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplatePreview;
use  IconvertEmailMarketer\App\Core\Admin\Actions\EmailTemplateTags;

use  IconvertEmailMarketer\App\Core\Structure\SendingOptions;


/**
 * Application
 */
class Application {


	/**
	 * Admin initialization
	 *
	 * @return void
	 */
	public static function boot() {
		new EmailTemplateCPT();

		//load the assets

		new EmailTemplateTags();
		new SendingOptions();

		new EmailTemplatePreview();
		new EditorActions();


	}


}
