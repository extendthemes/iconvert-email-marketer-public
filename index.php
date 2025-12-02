<?php
/**
 * Plugin Name: iConvert Email Marketer
 * Description: iConvert Email Marketer
 * Version: @@buildversion@@
 * Author: ExtendThemes
 * Text Domain: iconvert-email-marketer
 * License: GPL-3.0+
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Requires PHP: 7.4
 * Requires at least: 6.5
 */


// If this file is called directly, abort.
defined( 'WPINC' ) || die( 'yes, but actually no' );

use  IconvertEmailMarketer\App\Core\Frontend\Application;
use  IconvertEmailMarketer\App\Core\Structure\EditorLoader;
use  IconvertEmailMarketer\App\Core\Admin\Application as AdminApplication;



define( 'ICONVERTEM_VERSION', '@@buildversion@@' );
define( 'ICONVERTEM_BUILD_NUMBER', '@@buildnumber@@' );
define( 'ICONVERTEM_PATH', plugin_dir_path( __FILE__ ) );
define( 'ICONVERTEM_URL', plugin_dir_url( __FILE__ ) );
define( 'ICONVERTEM_ENTRY_FILE', __FILE__ );
define( 'ICONVERTEM_PAGE_FILE', __FILE__ );
define( 'ICONVERTEM_PAGE_ID', 'iconvertem' );


if ( ! defined( 'ICONVERTEM_API_URL' ) ) {
	define( 'ICONVERTEM_API_URL', 'https://mail-templates.iconvert.pro/wp-json/email-builder/v1' );
}


if ( ! defined( 'ICONVERTEM_RECOVERY_DELAY_MULTIPLIER' ) ) {
	define( 'ICONVERTEM_RECOVERY_DELAY_MULTIPLIER', 3600 );
}


require_once __DIR__ . '/vendor/autoload.php';

// HELPERS

require_once( ICONVERTEM_PATH . '/App/Helpers/Registry.php' );
require_once( ICONVERTEM_PATH . '/App/Helpers/WPHelpers.php' );
require_once( ICONVERTEM_PATH . '/App/Helpers/BlockHelpers.php' );



new EditorLoader();

//if ( ! (defined( 'ICONVERTEM_SKIP_PRO' ) && ICONVERTEM_SKIP_PRO) && file_exists( ICONVERTEM_PATH . '/pro/index.php' ) ) {
//	require_once ICONVERTEM_PATH . '/pro/index.php';
//}

if ( is_admin() ) {

	//load the admin/private code
	AdminApplication::boot();
} else {
	//load the frontend/public code
	Application::boot();
}


\IconvertEmailMarketer\Bootstrap::load();
