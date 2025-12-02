<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base;

use Throwable;

/**
 * The normalized exception class that should be throwed by all providers implementations in
 * case of an api error
 * Class ApiException
 * @package IConvert\Base
 */

class ApiException extends \Exception {

	/**
	 * ApiException __construct
	 *
	 * @param  mixed $message The error message
	 * @param  mixed $code The error Code
	 * @param  mixed $previous The previous Throwable
	 * @return void
	 */
	public function __construct( $message = '', $code = 0, Throwable $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}
}
