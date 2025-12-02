<?php

namespace  IconvertEmailMarketer\App\Core\Blocks;

class BlockRegistry {
	public static function register( $block_dir, $handle_class, $args = array() ) {
		add_action(
			'init',
			function() use ( $block_dir, $handle_class ) {
				register_block_type_from_metadata(
					$block_dir,
					array(
						'render_callback' => function( ...$args ) use ( $handle_class ) {
							$instance = new $handle_class();
							return call_user_func_array( array( $instance, 'init' ), $args );
						},
					)
				);
			}
		);
	}
}
