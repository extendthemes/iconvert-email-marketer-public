<?php
namespace IconvertEmailMarketer\ProvidersAPI\Base;


class Config {

	/**
	 *
	 * @var string $key API Key
	 */
	public $key = '';

	/**
	 *
	 * @var string $server Server ID|URL
	 */
	public $server = '';

	/**
	 *
	 * @var string $client_id The client ID
	 */
	public $client_id = '';

	/**
	 * Config __construct
	 *
	 * @param  mixed $key API Key
	 * @param  mixed $server Server ID|URL
	 * @param  mixed $client_id The client ID
	 * @return void
	 */
	public function __construct( $key, $server = '', $client_id = '' ) {
		$this->key       = $key;
		$this->server    = $server;
		$this->client_id = $client_id;
	}

	/**
	 * toArray Map the properties to an array
	 *
	 * @param  mixed $mappings The key mappings
	 * @return array Array of properties
	 */
	public function toArray( $mappings = array() ) {
		$f_arr = array();
		$arr   = get_object_vars( $this );
		foreach ( $arr as $key => $value ) {
			if ( isset( $mappings[ $key ] ) ) {
				$f_arr[ $mappings[ $key ] ] = $value;
			} else {
				$f_arr[ $key ] = $value;
			}
		}
		return $f_arr;
	}
}
