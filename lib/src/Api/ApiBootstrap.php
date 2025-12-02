<?php

namespace IconvertEmailMarketer\Api;


use IconvertEmailMarketer\Core\Singleton;

class ApiBootstrap {
	use Singleton;

	protected function __construct() {

		AdminPageApi::load();
	}


}
