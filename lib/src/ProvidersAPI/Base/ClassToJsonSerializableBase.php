<?php


namespace IconvertEmailMarketer\ProvidersAPI\Base;

use IlluminateAgnostic\Arr\Support\Arr;
use function array_filter;
use function array_merge;
use function array_values;

class ClassToJsonSerializableBase {

	/**
	 * @var array
	 */
	public $others = array();

	/**
	 * ClassToJsonSerializableBase constructor.
	 * @param $data
	 */
	public function __construct( $data = array(), $mappings = array() ) {
		$this->import( $data, $mappings );
	}

	/**
	 * @return false|string
	 */
	public function __toString() {
		return json_encode( $this );
	}

	/**
	 * @return mixed
	 */
	public function jsonSerialize(): mixed {
		return array_filter(
			get_object_vars( $this ),
			function ( $value ) {
				return $value !== null;
			}
		);
	}

	/**
	 * Import provider data to the normalized class instance
	 * The data is imported accordingly to the mappings parameters
	 * @param array $data The provider data to be imported
	 * @param array $mappings The provider mapping that defines the mapping of data to normalized version
	 */
	public function import( $data = array(), $mappings = array() ) {
		$data   = json_decode( json_encode( $data ), true );
		$others = $data;
		$unset  = array();
		foreach ( $mappings as $destination => $source ) {
			$value = Arr::get( $data, $source, null );
			if ( $value !== null ) {
				if ( property_exists( $this, $destination ) ) {
					$this->$destination    = $value;
					$unset[ $destination ] = $source;
				}
			}
		}

		// add unmapped props that have 1 to 1 match
		$props = get_object_vars( $this );
		foreach ( $props as $key => $value ) {
			if ( ! isset( $unset[ $key ] ) && Arr::exists( $data, $key ) ) {
				$this->$key    = Arr::get( $data, $key );
				$unset[ $key ] = $key;
			}
		}

		Arr::forget( $others, array_values( $unset ) );
		$this->others = $others;
	}

	/**
	 * Export provider data to the normalized class instance
	 * The data is exported accordingly to the mappings parameters
	 *
	 * @param $mappings The provider mappings that define the mapping of data from normalized version to provider data
	 * @param array $extra_fields Extra fields to be merged in (some providers may require additional non normalized defaults)
	 * @return array
	 */
	public function export( $mappings, $extra_fields = array(), $value_mapper = null ) {
		$data   = $this->jsonSerialize();
		$mapped = array();
		$data   = array_merge( array(), $extra_fields, $data );

		foreach ( $data as $key => $value ) {
			if ( $key !== 'others' && $value != null ) {
				$destination = Arr::get( $mappings, $key, $key );
				Arr::set( $mapped, $destination, $value );
			}
		}

		if ( $value_mapper ) {
			foreach ( $mapped as $key => $value ) {
				$new_value      = $value_mapper( $key, $value );
				$mapper[ $key ] = $new_value;
			}
		}

		return $mapped;
	}
}


// Check if the class doesn't exist and create a simple replacement
if (!class_exists('IlluminateAgnostic\Arr\Support\Arr')) {

    // Create the namespace structure
    if (!class_exists('IlluminateAgnostic\Arr\Support\Arr')) {
        class_alias('IconvertEmailMarketer\ProvidersAPI\Base\SimpleArrHelper', 'IlluminateAgnostic\Arr\Support\Arr');
    }

    /**
     * Simple replacement for IlluminateAgnostic\Arr\Support\Arr
     * This provides basic functionality that your code likely needs
     */
    class SimpleArrHelper {

        /**
         * Get a value from array using dot notation
         */
        public static function get($array, $key, $default = null) {
            if (is_null($key)) {
                return $array;
            }

            if (isset($array[$key])) {
                return $array[$key];
            }

            // Handle dot notation like 'sender.email'
            if (strpos($key, '.') !== false) {
                $keys = explode('.', $key);
                $value = $array;

                foreach ($keys as $segment) {
                    if (is_array($value) && isset($value[$segment])) {
                        $value = $value[$segment];
                    } else {
                        return $default;
                    }
                }

                return $value;
            }

            return $default;
        }

        /**
         * Set a value in array using dot notation
         */
        public static function set(&$array, $key, $value) {
            if (is_null($key)) {
                return $array = $value;
            }

            if (strpos($key, '.') === false) {
                $array[$key] = $value;
                return $array;
            }

            $keys = explode('.', $key);
            $current = &$array;

            foreach ($keys as $segment) {
                if (!is_array($current)) {
                    $current = [];
                }

                if (!isset($current[$segment])) {
                    $current[$segment] = [];
                }

                $current = &$current[$segment];
            }

            $current = $value;
            return $array;
        }

        /**
         * Check if key exists using dot notation
         */
        public static function has($array, $key) {
            if (!is_array($array) || is_null($key)) {
                return false;
            }

            if (isset($array[$key])) {
                return true;
            }

            if (strpos($key, '.') !== false) {
                $keys = explode('.', $key);
                $value = $array;

                foreach ($keys as $segment) {
                    if (is_array($value) && array_key_exists($segment, $value)) {
                        $value = $value[$segment];
                    } else {
                        return false;
                    }
                }

                return true;
            }

            return array_key_exists($key, $array);
        }

        /**
         * Flatten array
         */
        public static function flatten($array, $depth = INF) {
            $result = [];

            foreach ($array as $item) {
                if (!is_array($item)) {
                    $result[] = $item;
                } elseif ($depth === 1) {
                    $result = array_merge($result, $item);
                } else {
                    $result = array_merge($result, static::flatten($item, $depth - 1));
                }
            }

            return $result;
        }

        /**
         * Pluck values from array
         */
        public static function pluck($array, $value, $key = null) {
            $results = [];

            foreach ($array as $item) {
                $itemValue = is_object($item) ? $item->{$value} : $item[$value];

                if (is_null($key)) {
                    $results[] = $itemValue;
                } else {
                    $itemKey = is_object($item) ? $item->{$key} : $item[$key];
                    $results[$itemKey] = $itemValue;
                }
            }

            return $results;
        }

        /**
         * Only get specified keys from array
         */
        public static function only($array, $keys) {
            return array_intersect_key($array, array_flip((array) $keys));
        }

        /**
         * Get all except specified keys
         */
        public static function except($array, $keys) {
            return array_diff_key($array, array_flip((array) $keys));
        }
    }
}
