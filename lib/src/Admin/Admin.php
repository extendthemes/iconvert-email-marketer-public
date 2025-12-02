<?php

namespace IconvertEmailMarketer\Admin;


use  IconvertEmailMarketer\App\Core\Structure\EmailTemplatesRepository;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateCategoryRepository;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateCPT;
use IconvertEmailMarketer\Constants;
use IconvertEmailMarketer\Core\AssetsRegistry;
use IconvertEmailMarketer\Core\Singleton;
use IconvertEmailMarketer\Utils;

class Admin {
	use Singleton;

	protected function __construct() {

		$this->bootstrap();
	}

	public function bootstrap() {


		add_action( 'init', array( $this, 'registerSettingsPostType' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'loadAdminScripts' ) );

        add_action( 'admin_menu', array( $this, 'addMenuPage' ) );
		add_filter( 'plugin_row_meta', array( $this, 'addBuildNumberToInPluginsList' ), 10, 4 );

	}

	public function registerSettingsPostType() {

		if ( post_type_exists( Constants::$settingPostType ) ) {
			return;
		}

		$args = array(
			'label'               => __( 'Email marketer settings', 'iconvert-email-marketer'),
			'public'              => false,
			'show_ui'             => false,
			'show_in_rest'        => true,
			'show_in_menu'        => false,
			'show_in_nav_menus'   => false,
			'rewrite'             => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'rest_base'           => Constants::$settingPostType,
			'capabilities'        => array(
				'read'                   => 'edit_theme_options',
				'create_posts'           => 'edit_theme_options',
				'edit_posts'             => 'edit_theme_options',
				'edit_published_posts'   => 'edit_theme_options',
				'delete_published_posts' => 'edit_theme_options',
				'edit_others_posts'      => 'edit_theme_options',
				'delete_others_posts'    => 'edit_theme_options',
			),
			'map_meta_cap'        => true,
			'supports'            => array(
				'title',
				'editor',
				'revisions',
			),
		);

		register_post_type( Constants::$settingPostType, $args );

	}
	public function getNewTemplateBackendData() {


		$categories = EmailTemplateCategoryRepository::getInstance();
		$templates  = EmailTemplatesRepository::getInstance();
		$terms      = $categories->all();

		$new_template_data       = array(
			'terms'         => $terms,
			'templates'     => $templates->all(),
			'defaultImage'  => ICONVERTEM_URL . 'admin/assets/images/no-image-placeholder.svg',
			'blankImage'    => ICONVERTEM_URL . 'admin/assets/images/no-image-placeholder.svg',
			'allCategories' => implode( ', ', wp_list_pluck( $terms, 'slug' ) ),
		);

		return $new_template_data;
	}



	public function getBackendData() {
        $current_user = wp_get_current_user();


		$new_template_data = $this->getNewTemplateBackendData();
		$mail_taxonomies_terms = EmailTemplateCPT::getInstance()->get_taxonomy_terms();

		$settings = array(
			'base_url'          => site_url(),
			'admin_url'         => admin_url(),
			'ajax_url'          => admin_url( 'admin-ajax.php' ),
			'plugin_url'        => ICONVERTEM_URL,
			'admin_plugins_url' => admin_url( 'plugins.php' ),
            'current_user_email'    => $current_user->user_email,
            'ajax_nonce'         => wp_create_nonce('ajaxNonce'),
            'new_template_data' => $new_template_data,
			'main_taxonomies_terms' => $mail_taxonomies_terms,
			'withInternalTools'	=> defined('ICONVERTEM_WITH_INTERNAL_TOOLS') && \ICONVERTEM_WITH_INTERNAL_TOOLS,
			'contact_form_7_is_active' => Utils::getContactForm7IsActive(),
			'promoter_is_active' => Utils::getPromoterIsActive(),
		);


		return $settings;
	}

	public function loadBackendData() {
		$settings = $this->getBackendData();

		wp_add_inline_script(
			'jquery',
			sprintf(
				'window.iconvertemUtils = %s;',
				wp_json_encode( $settings )
			)
		);
	}

	public function loadAdminScripts() {

		if ( ! Utils::isMailBuilderAdminPage() ) {
			return;
		}


		AssetsRegistry::enqueueAssetGroup( 'admin/admin-pages' );
		AssetsRegistry::addInlineScript(
			'admin/admin-pages',
			sprintf(
				'window.iconvertemInit();',
			)
		);

		wp_enqueue_media();


		$this->loadBackendData();

		$preload_data = array(

			'/wp/v2/types?context=view',
			//this is needed for the product category and product slug
			'/wp/v2/types?context=edit',
			'/wp/v2/icem-settings-data?context=edit',
			'/wp/v2/templates?context=edit&per_page=-1',

		);

		$context = new \WP_Block_Editor_Context( array( 'name' => 'core/edit-site' ) );

		//Added in the 'wp-api-fetch' inline script
		if ( function_exists( 'block_editor_rest_api_preload' ) ) {
			\block_editor_rest_api_preload( $preload_data, $context );
		}
	}



    public function addMenuPage() {

        \add_menu_page(
            __( 'iConvert Mail', 'iconvert-email-marketer' ),
            __( 'iConvert Mail', 'iconvert-email-marketer' ),
            'manage_options',
            ICONVERTEM_PAGE_ID,
            array( $this, 'printAdminPageEntrypoint' ),
            'dashicons-email-alt',
            20
        );

        $this->addSubmenuPages();
    }

    public function addSubmenuPages() {
        $transaction_emails_slug = 'iconvertem-transactions-emails';
        $newsletters_emails_slug = 'iconvertem-newsletters-emails';
        $sending_settings_slug = "iconvertem-sending-settings";
        $email_log_slug = "iconvertem-email-log";
        $upgrade_to_pro_slug = "iconvertem-upgrade-to-pro";


        $submenu_slugs_array = array( $transaction_emails_slug, $newsletters_emails_slug, $sending_settings_slug, $email_log_slug, $upgrade_to_pro_slug );


//        \add_submenu_page(
//            ICONVERTEM_PAGE_ID,
//            __( 'Transactional emails'),
//            __( 'Transactional emails' ),
//            'manage_options',
//            $transaction_emails_slug,
//            array( $this, 'printAdminPageEntrypoint' ),
//        );

        \add_submenu_page(
            ICONVERTEM_PAGE_ID,
            __( 'Newsletters' , 'iconvert-email-marketer'),
            __( 'Newsletters', 'iconvert-email-marketer' ),
            'manage_options',
            $newsletters_emails_slug,
            array( $this, 'printAdminPageEntrypoint' ),
        );

        \add_submenu_page(
            ICONVERTEM_PAGE_ID,
            __( 'Sending Settings' , 'iconvert-email-marketer'),
            __( 'Sending Settings', 'iconvert-email-marketer' ),
            'manage_options',
            $sending_settings_slug,
            array( $this, 'printAdminPageEntrypoint' ),
        );

        if ( apply_filters( 'iconvertem_feature_available_only_in_pro', true ) ) {

            wp_add_inline_style(
                'admin-menu',
                '.iconvertem-upgrade-menu-item { display: flex; align-items: center; gap: 5px }' .
                '.iconvertem-upgrade-menu-item .dashicons { color: #ffc932; font-size: 24px; vertical-align: middle; margin: -0.15em .15em 0 0; }' .
                '*:not(.current):not(:hover) > .iconvertem-upgrade-menu-item .dashicons {opacity: 0.7; }'
            );

        }



        global $submenu;
        if ( isset( $submenu[ ICONVERTEM_PAGE_ID ] ) ) {
            foreach ( $submenu[ ICONVERTEM_PAGE_ID ] as $index => $submenu_item ) {
                $submenu_slug = $submenu_item[2];
                if ( $submenu_slug === ICONVERTEM_PAGE_ID ) {

                    //update the submenu label for the submenu generated from the primary menu page
                    $submenu[ ICONVERTEM_PAGE_ID ][ $index ][0] = __(  'Transactional emails', 'iconvert-email-marketer' );

                    $submenu[ ICONVERTEM_PAGE_ID][ $index ][2] = add_query_arg(
                            array(
                                'page' => ICONVERTEM_PAGE_ID
                            ),
                            admin_url( 'admin.php' )
                        ) . '#' . $transaction_emails_slug;
                }
                if ( in_array( $submenu_slug, $submenu_slugs_array ) ) {
                    $submenu[  ICONVERTEM_PAGE_ID ][ $index ][2] = add_query_arg(
                            array(
                                'page' => ICONVERTEM_PAGE_ID,
                            ),
                            admin_url( 'admin.php' )
                        ) . '#' . $submenu_slug;
                }
            }
        }
    }


    public function printAdminPageEntrypoint() {
        ?>

        <div id="iconvertem-admin-page">

        </div>
        <?php
    }

	public function addBuildNumberToInPluginsList( $plugin_meta, $plugin_file ) {
		$plugins_dir    = trailingslashit(
			wp_normalize_path( WP_CONTENT_DIR . '/plugins/' )
		);
		$target_plugin_file = str_replace(
			$plugins_dir,
			'',
			wp_normalize_path( ICONVERTEM_ENTRY_FILE )
		);
		if ( $plugin_file === $target_plugin_file ) {
			$plugin_meta[0] =
				"{$plugin_meta[0]} (build: " . ICONVERTEM_BUILD_NUMBER . ')';
		}

		return $plugin_meta;
	}

}
