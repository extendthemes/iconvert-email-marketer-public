<?php

namespace IconvertEmailMarketer\TransactionalEmailsDispatchers;


use IconvertEmailMarketer\Core\Singleton;

class MainDispatcher {
	use Singleton;

	protected function __construct() {
		ContactForm7Dispatcher::load();
		PromoterFormDispatcher::load();
	}
}
