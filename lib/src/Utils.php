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



}
