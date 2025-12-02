<?php

namespace  IconvertEmailMarketer\App\Core\Traits;

trait HasTemplate {
	//main template folder, used to separate admin and frontend in different folders
	public static $folder = 'resources/views';

	// the main layout
	public static $__layout = 'admin/_layout';

	public static $__sections = array();

	/**
	 * template - load a HTML template
	 *
	 * @param  mixed $template
	 * @param  mixed $args
	 * @param  mixed $echo
	 * @return void
	 */
	public static function template( $template, $args = array(), $echo = true ) {
		extract( $args );
		ob_start();
			// require ICONVERTEM_PATH . '/'.self::$folder.'/' . $template . '.php';
			require self::getTemplatePath( $template );
		$str = ob_get_clean();

		if (
			! $echo
		) {
			return $str;
		}
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $str;
	}

	public static function getTemplatePath( $template ) {
		return ICONVERTEM_PATH . '/' . self::$folder . '/' . $template . '.php';
	}

	public static function show404( $message = null ) {
		self::template( 'admin/_not_found', array( 'message' => $message ) );
	}

	public static function makeSection( $template, $args = array() ) {
		self::$__sections[ $template ] = self::template( $template, $args, false );
	}

	public static function section( $template ) {
		if ( isset( self::$__sections[ $template ] ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo self::$__sections[ $template ];
		}
	}

	public static function layout( $layout = false, $args = array() ) {
		if ( $layout ) {
			self::template( $layout, $args );
		} else {
			self::template( self::$__layout, $args );
		}
	}
}
