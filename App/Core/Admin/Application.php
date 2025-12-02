<?php

namespace  IconvertEmailMarketer\App\Core\Admin;

use  IconvertEmailMarketer\App\Core\Structure\SendingOptions;

use  IconvertEmailMarketer\App\Core\Admin\Actions\Assets;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateCPT;


use  IconvertEmailMarketer\App\Core\Admin\Actions\EditorActions;

use  IconvertEmailMarketer\App\Core\Structure\EmailTemplatePreview;
use  IconvertEmailMarketer\App\Core\Admin\Actions\EmailTemplateTags;



// use  IconvertEmailMarketer\App\Core\Admin\Structure\Menus;


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
		new SendingOptions();



		//load the assets
		new Assets();
		new EditorActions();
		new EmailTemplateTags();
		new EmailTemplatePreview();

	}
}
