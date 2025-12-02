<?php

namespace IconvertEmailMarketer\Core;

use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateCPT;
use IconvertEmailMarketer\Constants;


class Activation {
	use Singleton;

	protected function __construct() {
		register_activation_hook( ICONVERTEM_PAGE_FILE, array( $this, 'onActivate' ) );

	}


	public function onActivate() {
		$this->loadDefaultData();
		EmailTemplateCPT::getInstance()->init_taxonomy_terms();
	}

	public function loadDefaultData() {
		$query = new \WP_Query(
			array(
				'post_type'     => Constants::$settingPostType,
				'post_status'   => array( 'draft', 'publish' ),
				'no_found_rows' => true,
				'post_per_page' => 1,

			)
		);

		if ( ! $query->have_posts() ) {
			$this->insertDefaultData();
		}
	}

	public function insertDefaultData() {
		$content     = file_get_contents( ICONVERTEM_PATH . '/defaults/default-data.json'  );
		$postContent = json_encode( json_decode( $content, true ), JSON_FORCE_OBJECT );
		wp_insert_post(
			array(
				'post_content' => $postContent, // remove the pretty prints
				'post_status'  => 'publish',
				'post_type'    => Constants::$settingPostType,
				'post_name'    => Constants::$settingPostType,
				'post_title'   => __( 'Iconvert Mail Data', 'iconvert-email-marketer' ),
			),
			true
		);
	}

}
