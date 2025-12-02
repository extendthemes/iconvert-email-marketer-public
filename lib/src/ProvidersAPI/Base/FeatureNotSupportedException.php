<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base;

use Throwable;

/**
 * The normalized exception class that should be throwed by  providers in case the normalized method is not available
 * Class FeatureNotSupportedException
 * @package IConvert\Base
 */

class FeatureNotSupportedException extends \Exception {

	/**
	 * FeatureNotSupportedException __construct
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
