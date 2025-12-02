<?php

namespace IconvertEmailMarketer;

use IconvertEmailMarketer\Admin\Admin;
use IconvertEmailMarketer\Api\ApiBootstrap;
use IconvertEmailMarketer\Core\Activation;
use IconvertEmailMarketer\Core\AssetsRegistry;
use IconvertEmailMarketer\Core\Singleton;
use IconvertEmailMarketer\Core\SvgFilter;
use IconvertEmailMarketer\TransactionalEmailsDispatchers\MainDispatcher;


class Bootstrap {
	use Singleton;

	protected function __construct() {


		Activation::load();
		Admin::load();
		AssetsRegistry::load();
		SvgFilter::load();
		ApiBootstrap::load();
		MainDispatcher::load();
	}


	public static function load( ) {

		return self::getInstance();
	}
}
