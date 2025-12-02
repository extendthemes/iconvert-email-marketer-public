<?php

namespace IconvertEmailMarketer;

use IlluminateAgnostic\Arr\Support\Arr;
use SiteLeads\Core\AssetsRegistry;

class Utils {


    public static function getFilePath( $path ) {
        return ICONVERTEM_PATH . "$path";
    }

    public static function getUrl( $path ) {
        return ICONVERTEM_URL . "/$path";
    }


    public static function getAssetName( $name ) {
        return AssetsRegistry::getAssetHandle( $name );
    }

    public static function isMailBuilderAdminPage() {
        global $pagenow;

        if ( substr( $pagenow, 0, - 4 ) === 'admin' ) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $page = Arr::get( $_REQUEST, 'page', false );

            $available_pages = array(
                ICONVERTEM_PAGE_ID
            );

            return in_array( $page, $available_pages, true );
        }

        return false;
    }


	public static function getPromoterIsActive() {
		return defined( 'ICONVERTPR_VERSION' );
	}

	public static function getContactForm7IsActive() {
		return class_exists( '\WPCF7');
	}
	public static function isEmptyButCanBeZero($value) {
		return empty($value) && ($value !== 0 && $value !== '0');
	}
	public static function kubio_get_site_urls() {
		$urls = array(
			'homepage_url'      => 'https://kubiobuilder.com',
			'features_url'      => 'https://kubiobuilder.com/go/features',
			'upgrade_url'       => add_query_arg(
				array(
					'utm_theme'      => get_template(),
					'utm_childtheme' => get_stylesheet(),
				),
				'https://kubiobuilder.com/go/upgrade'
			),
			'try_url'           => add_query_arg(
				array(
					'utm_theme'      => get_template(),
					'utm_childtheme' => get_stylesheet(),
				),
				'https://kubiobuilder.com/go/try-demo'
			),
			'editor_try_online' => apply_filters(
				 'iconvertem/kubio/editor-try-online/url',
				add_query_arg(
					array(
						'utm_theme'      => get_template(),
						'utm_childtheme' => get_stylesheet(),
					),
					'https://kubiobuilder.com/go/try-online'
				)
			),
			'documentation_url' => add_query_arg(
				array(
					'utm_theme'      => get_template(),
					'utm_childtheme' => get_stylesheet(),
				),
				'https://kubiobuilder.com/go/documentation'
			),
			'contact_url'       => add_query_arg(
				array(
					'utm_theme'      => get_template(),
					'utm_childtheme' => get_stylesheet(),
				),
				'http://kubiobuilder.com/go/contact'
			),
			'facebook_url'      => 'https://www.facebook.com/kubiobuilder',
		);

		return apply_filters(  'iconvertem/kubio/get_site_urls' , $urls );
	}
	public static function kubio_get_site_url_for($key, $utms = array() ) {
		$urls = static::kubio_get_site_urls();
		$url  = Arr::get(
			$urls,
			$key,
			Arr::get( $urls, "{$key}_url", 'https://kubiobuilder.com' )
		);

		$utms = array_merge(
			array(
				'medium' => 'wp',
			),
			$utms
		);

		if ( ! empty( $utms ) ) {
			$formatted_utms = array();
			foreach ( array_keys( $utms ) as $key ) {
				$formatted_utms[ "utm_{$key}" ] = $utms[ $key ];
			}
			$url = add_query_arg( $formatted_utms, $url );
		}

		return $url;
	}
	public static function kubio_try_demo_url( $template_slug ) {
		list($url, $args) = explode( '?', static::kubio_get_site_url_for('try_url'));

		$url = untrailingslashit( $url ) . "/{$template_slug}";

		if ( $args ) {
			$url = "{$url}?{$args}";
		}

		return $url;
	}



}
