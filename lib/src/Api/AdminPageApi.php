<?php

namespace IconvertEmailMarketer\Api;


use IconvertEmailMarketer\Core\Singleton;
use IconvertEmailMarketer\Utils;

class AdminPageApi {
	use Singleton;

	protected function __construct() {

		$this->bootstrap();
	}

	public function bootstrap() {
		add_action(
			'rest_api_init',
			array($this, 'registerRestApiEndpoints')
		);

	}

	public function registerRestApiEndpoints() {
		$namespace = 'iconvertem/v1';
		register_rest_route(
			$namespace,
			'/contact-form-7/forms',
			array(
				'methods'             => 'GET',
				'callback'            => array($this, 'getContactForm7Forms'),
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},

			)
		);
		register_rest_route(
			$namespace,
			'/promoter/forms',
			array(
				'methods'             => 'GET',
				'callback'            => array($this, 'getPromoterFormsRestResponse'),
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},

			)
		);
	}

	public function getPromoterForms() {
		if ( ! Utils::getPromoterIsActive()) {
			return false;
		}


		$args = array(
			'post_type'      => 'cs-promo-popups',
			'posts_per_page' => - 1,
		);

		$query = new \WP_Query( $args );

		if ( ! $query->have_posts() ) {
			return array();
		}

		$posts               = $query->posts;
		$ignored_popup_types = array(
		);

		$filtered_posts = array_filter(
			$posts,
			function ( $post ) use ( $ignored_popup_types ) {
				$subscribe_block_search_term = "wp:cspromo/subscribe";
				//only get ones with subscribe block
				if(!str_contains($post->post_content, $subscribe_block_search_term)) {
					return false;
				}
				$popup_type = get_post_meta( $post->ID, 'popup_type', true );

				return ! in_array( $popup_type, $ignored_popup_types, true );
			}
		);

		$mapped = array();

		foreach ( $filtered_posts as $post ) {
			$mapped[] = array(
				'label' => $post->post_title,
				'value' => $post->ID,
			);
		}

		return $mapped;
	}
	public function getPromoterFormsRestResponse() {

		$forms = $this->getPromoterForms();
		if(empty($forms)) {
			$forms = [];
		}

		return new \WP_REST_Response(
			[
				'success' => true,
				'message' => '',
				'data'    => $forms,
			],
			200
		);
	}
	public function getContactForm7Forms() {
		$forms = array();
		if ( Utils::getContactForm7IsActive()) {
			$contact_form7_items = array();
			$args                = array(
				'post_type'      => 'wpcf7_contact_form',
				'posts_per_page' => - 1,
			);
			if ( $data = get_posts( $args ) ) {
				foreach ( $data as $key ) {
					$contact_form7_items[] = array(
						'label' => $key->post_title,
						'value' => $key->ID,
					);
				}
			}
			if ( count( $contact_form7_items ) > 0 ) {
				$forms = $contact_form7_items;
			}
		}

		return new \WP_REST_Response(
			[
				'success' => true,
				'message' => '',
				'data'    => $forms,
			],
			200
		);

	}
}
