<?php
namespace  IconvertEmailMarketer\App\Core\Traits;

trait IsSingleton {
	private static $instance  = null;
	private static $className = '';

	/**
	 * theClass
	 *
	 * @return void
	 */
	public static function theClass() {
		self::$className = get_class();
	}

	/**
	 * getInstance
	 *
	 * @return mixed
	 */
	public static function getInstance() {
		if ( self::$instance == null ) {
			self::theClass();

			self::$instance = new self::$className();
		}

		return self::$instance;
	}
}
