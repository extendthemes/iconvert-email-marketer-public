<?php

namespace  IconvertEmailMarketer\App\Core\Structure;

use IconvertEmailMarketer\Settings\EmailProviderSettings;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';

class SendingOptions {


	public function __construct() {
		$this->init();
	}

	public function init() {

		add_action( 'rest_api_init', array($this, 'register_rest_api') );
		// Override WordPress wp_mail with our SMTP settings
		add_action( 'phpmailer_init', array( $this, 'configure_wp_mail_smtp' ), 10, 1 );

		// Override wp_mail from name and from email
		add_filter( 'wp_mail_from', array( $this, 'custom_wp_mail_from' ), 10, 1 );
		add_filter( 'wp_mail_from_name', array( $this, 'custom_wp_mail_from_name' ), 10, 1 );
		add_filter( 'pre_wp_mail', array( $this, 'pre_wp_mail' ), 10, 1 );

		add_action(
			'admin_enqueue_scripts',
			function ( $hook ) {
				if ( $hook === 'icem-mail-tpl_page_iconvertem-sending-options' ) {
					$script_path = ICONVERTEM_URL . 'resources/scripts/sending-options.js';
					wp_enqueue_script( 'iconvertem-sending-options-handler', $script_path, array( 'jquery' ), null, true );

					$php_data_to_pass = array(
						'ajax_url' => admin_url( 'admin-ajax.php' ),
						'nonce'    => wp_create_nonce( 'iconvertem_test_connection' ),
					);

					wp_localize_script(
						'iconvertem-sending-options-handler',
						'iconvertemData',
						$php_data_to_pass
					);
				}
			}
		);
	}

	public function register_rest_api() {
		$namespace = 'iconvertem/v1';

		register_rest_route(
			$namespace,
			'/sending-options/test-connection',
			array(
				'methods'             => 'POST',
				'callback'            => array($this, 'test_provider_connection'),
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},

			)
		);
		register_rest_route(
			$namespace,
			'/sending-options/send-test-email',
			array(
				'methods'             => 'POST',
				'callback'            => array($this, 'send_test_email'),
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},

			)
		);
	}
	/**
	 * Pre-configure SMTP to get wp_mail early
	 */
	public function pre_configure_smtp( $args ) {

		$selected_provider = $this->get_selected_provider() ?? '';

		if ( $selected_provider === 'smtp' ) {
			// Set a global flag that we need SMTP
			global $iconvertem_force_smtp;
			$iconvertem_force_smtp = true;
		}
		return $args;
	}

	public function pre_wp_mail( $response ) {


		$selected_provider = $this->get_selected_provider() ?? '';

		// if there is a selected provider, override phpmailer global instance with our extended class
		// this will ensure our postSend method is called, and we will preserve teh original functionality
		if ( $selected_provider && $selected_provider !== 'smtp' ) {
			global $phpmailer;

			if ( ! class_exists( '\WP_PHPMailer' ) ) {
				require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
				require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
				require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
				require_once ABSPATH . WPINC . '/class-wp-phpmailer.php';
			}

			$phpmailer = new CustomMailer( true, $selected_provider, $this->get_provider_settings( $selected_provider ) );

			$phpmailer::$validator = static function ( $email ) {
				return (bool) is_email( $email );
			};
		}

		return $response;

	}








	public function test_provider_connection() {


		$provider = $this->get_selected_provider();


		if ( ! $provider ) {
			return new \WP_Error(
				'error',
				__('No valid provider: ', 'iconvert-email-marketer') . $provider,
				[ 'status' => 500 ]
			);
		}

		// Get form data from the unified form


		switch ( $provider ) {
			case 'smtp':
				$provider_settings     = $this->get_provider_settings('smtp');
				$host       =$provider_settings['host'] ?? '' ;
				$port       = $provider_settings['port'] ?? '' ;
				$username   = $provider_settings['username'] ?? '' ;
				$password   = $provider_settings['password'] ?? '' ;
				$encryption = $provider_settings['encryption'] ?? ''  ;

				if ( empty( $host ) || empty( $username ) || empty( $password ) ) {
					return new \WP_Error(
						'error',
						__('Please fill in all required SMTP fields (Host, Username, Password)', 'iconvert-email-marketer'),
						[ 'status' => 500 ]
					);

				}

				$mail = new PHPMailer( true );
				try {

					$mail->isSMTP();
					$mail->Host       = $host;
					$mail->SMTPAuth   = true;
					$mail->Username   = $username;
					$mail->Password   = $password;
					$mail->SMTPSecure = $encryption === 'none' ? false : $encryption;
					$mail->Port       = $port;
					$mail->Timeout    = 30;

					// Additional settings for better compatibility
					$mail->SMTPOptions = array(
						'ssl' => array(
							'verify_peer'       => false,
							'verify_peer_name'  => false,
							'allow_self_signed' => true,
						),
					);

					// Test connection
					if ( $mail->smtpConnect() ) {
						$mail->smtpClose();
						return new \WP_REST_Response(
							[
								'success' => true,
								'message' => __('SMTP connection successful!', 'iconvert-email-marketer')
							],
							200
						);

					} else {
						return new \WP_Error(
							'error',
							__('SMTP connection failed', 'iconvert-email-marketer'),
							[ 'status' => 500 ]
						);

					}
				} catch ( Exception $e ) {
					$error_msg = $e->getMessage();

					// Provide more specific error messages
					if ( strpos( $error_msg, 'Connection refused' ) !== false ) {
						$error_msg .= " - Check if port {$port} is blocked by your firewall or ISP.";
					} elseif ( strpos( $error_msg, 'getaddrinfo failed' ) !== false ) {
						$error_msg .= ' - DNS resolution failed. Check your internet connection.';
					} elseif ( strpos( $error_msg, 'Username/Password' ) !== false ) {
						$error_msg .= ' - Use App Password for Gmail, not your regular password.';
					}

					return new \WP_Error(
						'error',
						__('SMTP error: ', 'iconvert-email-marketer') . $error_msg,
						[ 'status' => 500 ]
					);

				}
				break;

			case 'campaign-monitor':
				$provider_settings     = $this->get_provider_settings('campaign-monitor');
			    $api_key   =  $provider_settings['api_key'] ?? '';
			    $client_id =  $provider_settings['client_id'] ?? '';

			    if ( empty( $api_key ) || empty( $client_id ) ) {
					return new \WP_Error(
						'error',
						__('Please fill in API Key and Client ID', 'iconvert-email-marketer'),
						[ 'status' => 500 ]
					);
			    }

			    // Test both regular API and transactional API capabilities
			    $regular_api_url = "https://api.createsend.com/api/v3.3/clients/{$client_id}.json";
			    $regular_args = array(
			        'headers' => array(
			            'Authorization' => 'Basic ' . base64_encode( $api_key . ':x' ),
			            'Content-Type'  => 'application/json',
			        ),
			        'timeout' => 15,
			    );
			    $regular_response = wp_remote_get( $regular_api_url, $regular_args );

			    // Test transactional email capability by checking statistics endpoint
			    $transactional_test_url = "https://api.createsend.com/api/v3.3/transactional/statistics";
			    if ( !empty( $client_id ) ) {
			        $transactional_test_url .= '?clientID=' . urlencode( $client_id );
			    }

			    $transactional_args = array(
			        'headers' => array(
			            'Authorization' => 'Basic ' . base64_encode( $api_key . ':x' ),
			            'Content-Type'  => 'application/json',
			            'Accept' => 'application/json'
			        ),
			        'timeout' => 15,
			    );
			    $transactional_response = wp_remote_get( $transactional_test_url, $transactional_args );

			    // Check regular API response
			    $regular_success = !is_wp_error( $regular_response ) && wp_remote_retrieve_response_code( $regular_response ) === 200;

			    // Check transactional API response (200 or 404 both indicate API key works, 401/403 indicate auth issues)
			    $transactional_code = is_wp_error( $transactional_response ) ? 0 : wp_remote_retrieve_response_code( $transactional_response );
			    $transactional_success = in_array( $transactional_code, [200, 404] ); // 404 means endpoint exists but no data

			    if ( $regular_success && $transactional_success ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => 'Campaign Monitor connection successful! Both regular API and transactional email are accessible.'
						],
						200
					);

			    } elseif ( $regular_success ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => 'Campaign Monitor regular API works, but transactional email may not be enabled for your account. Contact Campaign Monitor support if needed.'
						],
						200
					);
			    } else {
			        $error_message = 'Campaign Monitor connection failed';

			        if ( is_wp_error( $regular_response ) ) {
			            $error_message .= ' - ' . $regular_response->get_error_message();
			        } else {
			            $regular_code = wp_remote_retrieve_response_code( $regular_response );
			            $regular_body = wp_remote_retrieve_body( $regular_response );
			            $decoded_body = json_decode( $regular_body, true );

			            if ( $regular_code === 401 ) {
			                $error_message .= ' - Invalid API key or unauthorized access';
			            } elseif ( $regular_code === 404 ) {
			                $error_message .= ' - Client ID not found or invalid';
			            } elseif ( isset( $decoded_body['Message'] ) ) {
			                $error_message .= ' - ' . $decoded_body['Message'];
			            } else {
			                $error_message .= ' - HTTP ' . $regular_code;
			            }
			        }
					return new \WP_Error(
						'error',
						$error_message,
						[ 'status' => 500 ]
					);

			    }
			    return;
			    break;

			case 'send-in-blue':
				$provider_settings     = $this->get_provider_settings('send-in-blue');
				$api_key =  $provider_settings['api_key'] ?? '';

				if ( empty( $api_key ) ) {
					return new \WP_Error(
						'error',
						'Please fill in API Key' ,
						[ 'status' => 500 ]
					);

				}

				$api_url  = 'https://api.brevo.com/v3/account';
				$args     = array(
					'headers' => array(
						'api-key'      => $api_key,
						'Content-Type' => 'application/json',
						'Accept'       => 'application/json',
					),
					'timeout' => 30,
				);
				$response = wp_remote_get( $api_url, $args );
				break;

			case 'mail-jet':
				$provider_settings     = $this->get_provider_settings('mail-jet');
				$api_key    =  $provider_settings['api_key'] ?? '' ;
				$secret_key =  $provider_settings['secret_key'] ?? '';

				if ( empty( $api_key ) || empty( $secret_key ) ) {
					return new \WP_Error(
						'error',
						__('Please fill in both API Key and Secret Key' , 'iconvert-email-marketer') ,
						[ 'status' => 500 ]
					);

				}

				$api_url     = 'https://api.mailjet.com/v3/REST/user';
				$auth_string = base64_encode( $api_key . ':' . $secret_key );
				$api_args        = array(
					'headers' => array(
						'Authorization' => 'Basic ' . $auth_string,
						'Content-Type'  => 'application/json',
						'Accept'        => 'application/json',
					),
					'timeout' => 15,
				);
				// $response    = wp_remote_get( $api_url, $args );
				$api_response = wp_remote_get( $api_url, $api_args );

				// Also test SMTP connection as fallback
				$smtp_test_passed = false;
				try {
					$mail = new PHPMailer( true );
					$mail->isSMTP();
					$mail->Host       = 'in-v3.mailjet.com';
					$mail->SMTPAuth   = true;
					$mail->Username   = $api_key;
					$mail->Password   = $secret_key;
					$mail->SMTPSecure = 'tls';
					$mail->Port       = 587;
					$mail->Timeout    = 15;
					if ( $mail->smtpConnect() ) {
						$mail->smtpClose();
						$smtp_test_passed = true;
					}
				} catch ( Exception $e ) {
					// SMTP test failed, but we'll still check API
				}
				// Evaluate results
				$api_passed = ! is_wp_error( $api_response ) && wp_remote_retrieve_response_code( $api_response ) === 200;
				if ( $api_passed && $smtp_test_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __('MailJet API and SMTP connections successful!' , 'iconvert-email-marketer'),
						],
						200
					);
				} elseif ( $api_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __( 'MailJet API connection successful! (SMTP connection had issues but API works)', 'iconvert-email-marketer'),
						],
						200
					);
				} elseif ( $smtp_test_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __( 'MailJet SMTP connection successful! (API connection had issues but SMTP works)' , 'iconvert-email-marketer'),
						],
						200
					);

				} else {
					$error_message = 'MailJet connection failed';
					if ( is_wp_error( $api_response ) ) {
						$error_message .= ' - API Error: ' . $api_response->get_error_message();
					} else {
						$api_code = wp_remote_retrieve_response_code( $api_response );
						$api_body = wp_remote_retrieve_body( $api_response );
						$decoded_body = json_decode( $api_body, true );
						if ( isset( $decoded_body['ErrorMessage'] ) ) {
							$error_message .= ' - API Error: ' . $decoded_body['ErrorMessage'];
						} else {
							$error_message .= ' - API returned HTTP ' . $api_code;
						}
					}
					return new \WP_Error(
						'error',
						$error_message,
						[ 'status' => 500 ]
					);
				}
				return; // Early return to avoid the generic response handling below
				break;

			case 'moo-send':
				$provider_settings     = $this->get_provider_settings('moo-send');
			    $api_key =  $provider_settings['api_key'] ?? '';

			    if ( empty( $api_key ) ) {
					return new \WP_Error(
						'error',
						__( 'Please fill in API Key', 'iconvert-email-marketer'),
						[ 'status' => 500 ]
					);

			    }

			    // Test API connectivity to verify the API key works
			    $api_url = 'https://api.moosend.com/v3/lists.json?apikey=' . urlencode( $api_key );
			    $api_response = wp_remote_get( $api_url, array(
			        'timeout' => 15,
			        'sslverify' => true,
			        'headers' => array(
			            'User-Agent' => 'WordPress-MooSend-Plugin/1.0'
			        )
			    ) );

			    $api_passed = !is_wp_error( $api_response ) && wp_remote_retrieve_response_code( $api_response ) === 200;

			    if ( $api_passed ) {
			        // Test SMTP connection as this is what we'll actually use
			        try {
			            $smtp_test = new PHPMailer( true );
			            $smtp_test->isSMTP();
			            $smtp_test->Host = 'smtp.moosend.com';
			            $smtp_test->SMTPAuth = true;
			            $smtp_test->Username = $api_key;
			            $smtp_test->Password = $api_key;
			            $smtp_test->SMTPSecure = 'tls';
			            $smtp_test->Port = 587;
			            $smtp_test->Timeout = 15;
			            $smtp_test->SMTPOptions = array(
			                'ssl' => array(
			                    'verify_peer' => false,
			                    'verify_peer_name' => false,
			                    'allow_self_signed' => true,
			                ),
			            );

			            if ( $smtp_test->smtpConnect() ) {
			                $smtp_test->smtpClose();
							return new \WP_REST_Response(
								[
									'success' => true,
									'message' => __( 'MooSend API key verified and SMTP connection successful! Ready to send emails via SMTP.' , 'iconvert-email-marketer'),
								],
								200
							);

			            } else {
							return new \WP_Error(
								'error',
								__( 'MooSend API key verified but SMTP connection failed. Please check your server\'s outgoing email settings.', 'iconvert-email-marketer' ),
								[ 'status' => 500 ]
							);

			            }
			        } catch ( Exception $e ) {
						return new \WP_Error(
							'error',
							'MooSend API key verified. SMTP connection had issues (' . $e->getMessage() . ') but configuration saved.' ,
							[ 'status' => 500 ]
						);

			        }
			    } else {
			        $error_message = 'MooSend connection failed';

			        if ( is_wp_error( $api_response ) ) {
			            $error_message .= ' - API Error: ' . $api_response->get_error_message();
			        } else {
			            $api_code = wp_remote_retrieve_response_code( $api_response );
			            $api_body = wp_remote_retrieve_body( $api_response );
			            $decoded_body = json_decode( $api_body, true );

			            if ( $api_code === 401 || $api_code === 403 ) {
			                $error_message .= ' - Invalid API key or unauthorized access';
			            } elseif ( isset( $decoded_body['Error'] ) ) {
			                $error_message .= ' - API Error: ' . $decoded_body['Error'];
			            } else {
			                $error_message .= ' - API returned HTTP ' . $api_code;
			            }
			        }
					return new \WP_Error(
						'error',
						$error_message,
						[ 'status' => 500 ]
					);


			    }
			    return;
			    break;

			case 'get-response':
				$provider_settings     = $this->get_provider_settings('get-response');
				$api_key =  $provider_settings['api_key'] ?? '';
				if ( empty( $api_key ) ) {
					return new \WP_Error(
						'error',
						__('Please fill in API Key' , 'iconvert-email-marketer'),
						[ 'status' => 500 ]
					);

				}
				$response = wp_remote_get(
					'https://api.getresponse.com/v3/accounts',
					array(
						'headers' => array(
							'X-Auth-Token' => 'api-key ' . $api_key,
							'Content-Type' => 'application/json',
						),
						'timeout' => 10,
					)
				);
				break;
			case 'send-grid':
				$provider_settings     = $this->get_provider_settings('send-grid');
				$api_key =  $provider_settings['api_key'] ?? '';


			    if ( empty( $api_key ) ) {
					return new \WP_Error(
						'error',
						__('Please fill in API Key' , 'iconvert-email-marketer'),
						[ 'status' => 500 ]
					);

			    }

			    // Test API connectivity
			    $api_url = 'https://api.sendgrid.com/v3/user/account';
			    $api_args = array(
			        'headers' => array(
			            'Authorization' => 'Bearer ' . $api_key,
			            'Content-Type'  => 'application/json',
			            'Accept'        => 'application/json',
			        ),
			        'timeout' => 15,
			    );
			    $api_response = wp_remote_get( $api_url, $api_args );

			    // Also test SMTP as fallback
			    $smtp_test_passed = false;
			    try {
			        $smtp_test = new PHPMailer( true );
			        $smtp_test->isSMTP();
			        $smtp_test->Host = 'smtp.sendgrid.net';
			        $smtp_test->SMTPAuth = true;
			        $smtp_test->Username = 'apikey';
			        $smtp_test->Password = $api_key;
			        $smtp_test->SMTPSecure = 'tls';
			        $smtp_test->Port = 587;
			        $smtp_test->Timeout = 15;
			        $smtp_test->SMTPOptions = array(
			            'ssl' => array(
			                'verify_peer' => false,
			                'verify_peer_name' => false,
			                'allow_self_signed' => true,
			            ),
			        );

			        if ( $smtp_test->smtpConnect() ) {
			            $smtp_test->smtpClose();
			            $smtp_test_passed = true;
			        }
			    } catch ( Exception $e ) {
			        // SMTP test failed, but we'll still check API
			    }

			    // Evaluate results
			    $api_passed = !is_wp_error( $api_response ) && wp_remote_retrieve_response_code( $api_response ) === 200;

			    if ( $api_passed && $smtp_test_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __( 'SendGrid API and SMTP connections successful!' , 'iconvert-email-marketer'),
						],
						200
					);

			    } elseif ( $api_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __(  'SendGrid API connection successful! (SMTP connection had issues but API works)' , 'iconvert-email-marketer' ),
						],
						200
					);

			    } elseif ( $smtp_test_passed ) {
					return new \WP_REST_Response(
						[
							'success' => true,
							'message' => __( 'SendGrid SMTP connection successful! (API connection had issues but SMTP works)' , 'iconvert-email-marketer' ),
						],
						200
					);

			    } else {
			        $error_message = __('SendGrid connection failed', 'iconvert-email-marketer');

			        if ( is_wp_error( $api_response ) ) {
			            $error_message .= ' - API Error: ' . $api_response->get_error_message();
			        } else {
			            $api_code = wp_remote_retrieve_response_code( $api_response );
			            $api_body = wp_remote_retrieve_body( $api_response );
			            $decoded_body = json_decode( $api_body, true );

			            if ( $api_code === 401 || $api_code === 403 ) {
			                $error_message .= ' - Invalid API key or insufficient permissions';
			            } elseif ( isset( $decoded_body['errors'][0]['message'] ) ) {
			                $error_message .= ' - API Error: ' . $decoded_body['errors'][0]['message'];
			            } else {
			                $error_message .= ' - API returned HTTP ' . $api_code;
			            }
			        }
					return new \WP_Error(
						'error',
						$error_message,
						[ 'status' => 500 ]
					);

			    }
			    return;
			    break;

			default:
				return new \WP_Error(
					'error',
					__('Unknown provider: ', 'iconvert-email-marketer') . $provider ,
					[ 'status' => 500 ]
				);

		}

		// Handle API response (for non-SMTP providers)
		if ( isset( $response ) ) {
			if ( is_wp_error( $response ) ) {
				return new \WP_Error(
					'error',
					$response->get_error_message(),
					[ 'status' => 500 ]
				);

			}

			$code = wp_remote_retrieve_response_code( $response );
			$body = wp_remote_retrieve_body( $response );

			if ( $code === 200 ) {
				return new \WP_REST_Response(
					[
						'success' => true,
						'message' =>  ucfirst( $provider ) . __(' connection successful!' , 'iconvert-email-marketer')
					],
					200
				);

			} else {
				$error_message = $provider . ' connection failed';
				if ( $body ) {
					$decoded_body = json_decode( $body, true );
					if ( isset( $decoded_body['message'] ) ) {
						$error_message .= ': ' . $decoded_body['message'];
					} elseif ( isset( $decoded_body['ErrorMessage'] ) ) {
						$error_message .= ': ' . $decoded_body['ErrorMessage'];
					} else {
						$error_message .= ' (HTTP ' . $code . ')';
					}
				}
				return new \WP_Error(
					'error',
					$error_message,
					[ 'status' => 500 ]
				);

			}
		}

		return new \WP_Error(
			'error',
			__('Unknown provider: ', 'iconvert-email-marketer') . $provider ,
			[ 'status' => 500 ]
		);
	}

	public function send_test_email() {

		$provider = $this->get_selected_provider();
		if ( empty( $provider ) ) {
			return new \WP_Error(
				'error',
				__('No provider selected', 'iconvert-email-marketer'),
				[ 'status' => 500 ]
			);

		}


		$test_email      = $this->get_from_email() ?: get_option( 'admin_email' );

		if ( empty( $test_email ) ) {
			return new \WP_Error(
				'error',
				__( 'No email address available for testing. Please set From Email or check your WordPress admin email.', 'iconvert-email-marketer'),
				[ 'status' => 500 ]
			);

		}

		// Validate provider settings before attempting to send
		if ( $provider === 'smtp' ) {
			$smtp_settings = $this->get_smtp_settings();
			if ( empty( $smtp_settings['host'] ) || empty( $smtp_settings['username'] ) || empty( $smtp_settings['password'] ) ) {
				return new \WP_Error(
					'error',
					__( 'SMTP settings are incomplete. Please save your settings first.' , 'iconvert-email-marketer'),
					[ 'status' => 500 ]
				);

			}
		}

		// Capture any wp_mail errors
		$mail_error = '';
		add_action(
			'wp_mail_failed',
			function( $wp_error ) use ( &$mail_error ) {
				$mail_error = $wp_error->get_error_message();
			}
		);

		// Send test email
		$subject = 'Email Configuration Test - ' . current_time('Y-m-d H:i:s');
		$message = '<html><body>';
		$message .= '<h2>Email Configuration Test</h2>';
		$message .= '<p>This is a test email to verify your email configuration is working properly.</p>';
		$message .= '<table style="border-collapse:collapse;width:100%;margin:10px 0;">';
		$message .= '<tr><td style="padding:5px;"><strong>Provider:</strong></td><td style="padding:5px;">' . ucfirst($provider) . '</td></tr>';
		$message .= '<tr><td style="padding:5px;"><strong>From Name:</strong></td><td style="padding:5px;">' . ($this->get_from_name() ?: 'Not Set') . '</td></tr>';
		$message .= '<tr><td style="padding:5px;"><strong>From Email:</strong></td><td style="padding:5px;">' . ($this->get_from_email() ?: 'Not Set') . '</td></tr>';
		$message .= '<tr><td style="padding:5px;"><strong>Sent At:</strong></td><td style="padding:5px;">' . current_time('Y-m-d H:i:s') . '</td></tr>';
		$message .= '</table>';
		$message .= '<hr><p><small>This email was sent via the ICONVERTEM Email Editor plugin.</small></p>';
		$message .= '</body></html>';

		$headers = array( 'Content-Type: text/html; charset=UTF-8' );
		$result  = wp_mail( $test_email, $subject, $message, $headers );


		if ( $result ) {
			return new \WP_REST_Response(
				[
					'success' => true,
					// translators: %s - email
					'message' => sprintf(__( "Test email sent successfully to %s ! Check your inbox.", 'iconvert-email-marketer'), $test_email)
				],
				200
			);

	    } else {
	        $error_message = 'Failed to send test email.';

	        if ( ! empty( $mail_error ) ) {
	            // Parse common error patterns for user-friendly messages
	            if ( strpos( $mail_error, 'domain must match' ) !== false ) {
	                $error_message = 'Campaign Monitor Error: Your From email domain must be authenticated in your Campaign Monitor account. Please either authenticate the domain or use a different From email address.';
	            } elseif ( strpos( $mail_error, 'transactional email is not available' ) !== false ) {
	                $error_message = 'Campaign Monitor Error: Transactional email is not available on your account. Please upgrade to a paid plan.';
	            } elseif ( strpos( $mail_error, 'Authentication failed' ) !== false ) {
	                $error_message = 'Campaign Monitor Error: Authentication failed. Please check your API key and Client ID.';
	            } elseif ( strpos( $mail_error, 'not enabled' ) !== false ) {
	                $error_message = 'Campaign Monitor Error: Transactional email service is not enabled on your account.';
	            } else {
	                $error_message .= ' Error: ' . $mail_error;
	            }
	        }

			return new \WP_Error(
				'error',
				$error_message,
				[ 'status' => 500 ]
			);
	    }
		return new \WP_Error(
			'error',
			"Unokwn Error",
			[ 'status' => 500 ]
		);
	}




	/**
	 * Get current global settings
	 */
	public function get_global_settings() {
		return get_option(
			'iconvertem_global_settings',
			array(
				'from_name'         => '',
				'from_email'        => '',
				'selected_provider' => '',
			)
		);
	}

	/**
	 * Get current provider settings
	 */
	public function get_provider_settings( $provider ) {
		switch($provider) {
			case 'smtp':
				return $this->get_smtp_settings();
			case 'send-grid':
				return $this->get_send_grid_settings();
			case 'moo-send':
				return $this->get_moo_send_settings();
			case 'mail-jet':
				return $this->get_mail_jet_settings();
			case 'campaign-monitor':
				return $this->get_campaign_monitor_settings();
			default:
				return [];
		}
	}


	public function get_smtp_settings() {
		return EmailProviderSettings::getInstance()->getSmtpSettings();

	}
	public function get_send_grid_settings() {
		return [
			'api_key' =>  EmailProviderSettings::getInstance()->getSendGridApiKey()
		];
	}
	public function get_moo_send_settings() {
		return [
			'api_key' =>  EmailProviderSettings::getInstance()->getMooSendApiKey()
		];
	}
	public function get_mail_jet_settings() {
		return [
			'api_key' =>  EmailProviderSettings::getInstance()->getMailJetApiKey(),
			'secret_key' => EmailProviderSettings::getInstance()->getMailJetSecretKey(),
		];
	}
	public function get_campaign_monitor_settings() {
		return [
			'api_key' =>  EmailProviderSettings::getInstance()->getCampaignMonitorApiKey(),
			'client_id' =>  EmailProviderSettings::getInstance()->getCampaignMonitorClientId(),
		];
	}

	public function get_selected_provider() {
		return EmailProviderSettings::getInstance()->getSelectedProvider();
	}


	/**
	 * Get from name from global settings
	 */
	public function get_from_name() {
		return EmailProviderSettings::getInstance()->getFromName();

	}

	/**
	 * Get from email from global settings
	 */
	public function get_from_email() {
		return EmailProviderSettings::getInstance()->getFromEmail();

	}

	/**
	 * Configure PHPMailer to use our SMTP settings for all wp_mail() calls
	 * This is the MAIN function that overrides WordPress default mail behavior
	 */
	public function configure_wp_mail_smtp( $phpmailer ) {


		$selected_provider = $this->get_selected_provider() ?? '';



		if ( $selected_provider === 'smtp' ) {
			$smtp_settings = $this->get_smtp_settings();

			// Validate SMTP settings are complete
			if ( empty( $smtp_settings['host'] ) || empty( $smtp_settings['username'] ) || empty( $smtp_settings['password'] ) ) {
				return;
			}

			try {
				// Set to SMTP mode
				$phpmailer->isSMTP();
				$phpmailer->Host     = $smtp_settings['host'];
				$phpmailer->SMTPAuth = true;
				$phpmailer->Username = $smtp_settings['username'];
				$phpmailer->Password = $smtp_settings['password'];

				// Handle encryption properly
				if ( empty($smtp_settings['encryption']) || $smtp_settings['encryption'] === 'none' ) {
					$phpmailer->SMTPSecure  = '';
					$phpmailer->SMTPAutoTLS = false;
				} else {
					$phpmailer->SMTPSecure  = $smtp_settings['encryption'];
					$phpmailer->SMTPAutoTLS = true;
				}

				$phpmailer->Port    = absint( $smtp_settings['port'] ?: 587 );
				$phpmailer->Timeout = 30;

				// Additional settings for better compatibility
				$phpmailer->SMTPOptions = array(
					'ssl' => array(
						'verify_peer'       => false,
						'verify_peer_name'  => false,
						'allow_self_signed' => true,
					),
				);

			} catch ( Exception $e ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
				error_log( 'SMTP configuration error: ' . $e->getMessage() );
			}
		}
		// MailJet SMTP configuration
	    elseif ( $selected_provider === 'mail-jet' ) {
	        $mailjet_settings = $this->get_provider_settings( 'mail-jet' );

	        // Validate MailJet settings are complete
	        if ( empty( $mailjet_settings['api_key'] ) || empty( $mailjet_settings['secret_key'] ) ) {
	            return;
	        }

	        try {
	            // Configure MailJet SMTP
	            $phpmailer->isSMTP();
	            $phpmailer->Host       = 'in-v3.mailjet.com';
	            $phpmailer->SMTPAuth   = true;
	            $phpmailer->Username   = $mailjet_settings['api_key'];
	            $phpmailer->Password   = $mailjet_settings['secret_key'];
	            $phpmailer->SMTPSecure = 'tls';
	            $phpmailer->Port       = 587;
	            $phpmailer->Timeout    = 30;

	            // Additional settings for better compatibility
	            $phpmailer->SMTPOptions = array(
	                'ssl' => array(
	                    'verify_peer'       => false,
	                    'verify_peer_name'  => false,
	                    'allow_self_signed' => true,
	                ),
	            );

	            // REMOVED: Don't add forbidden headers
	            // MailJet doesn't allow X-Mailjet-Campaign header in custom headers

	            $phpmailer->isHTML(true);
	            $phpmailer->CharSet = 'UTF-8';
	            $phpmailer->Encoding = '8bit';

	        } catch ( Exception $e ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	            error_log( 'MailJet SMTP configuration error: ' . $e->getMessage() );
	        }
	    }
	    // MooSend
	    elseif ( $selected_provider === 'moo-send' ) {
		    $moosend_settings = $this->get_provider_settings( 'moo-send' );
		    $api_key = $moosend_settings['api_key'] ?? '';


		    if ( empty( $api_key ) ) {
		        return;
		    }

		    try {
		        // Configure SMTP for MooSend
		        $phpmailer->isSMTP();
		        $phpmailer->Host       = 'smtp.moosend.com';
		        $phpmailer->SMTPAuth   = true;
		        $phpmailer->Username   = $api_key;
		        $phpmailer->Password   = $api_key;
		        $phpmailer->SMTPSecure = 'tls';
		        $phpmailer->Port       = 587;
		        $phpmailer->Timeout    = 30;

		        // SSL settings for better compatibility
		        $phpmailer->SMTPOptions = array(
		            'ssl' => array(
		                'verify_peer'       => false,
		                'verify_peer_name'  => false,
		                'allow_self_signed' => true,
		            ),
		        );

		        // ENABLE DEBUGGING - ADD THESE LINES
		        $phpmailer->SMTPDebug = 2; // Enable verbose debug output
		        $phpmailer->Debugoutput = function($str, $level) {

		        };

		        $phpmailer->isHTML(true);
		        $phpmailer->CharSet = 'UTF-8';
		        $phpmailer->Encoding = '8bit';

		        // Add MooSend specific headers
		        $phpmailer->addCustomHeader('X-Mailer', 'WordPress-MooSend-Plugin');


		    } catch ( Exception $e ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		        error_log( 'MooSend SMTP configuration error: ' . $e->getMessage() );
		    }
		}
		elseif ( $selected_provider === 'send-grid' ) {
			$provider_settings = $this->get_provider_settings( 'send-grid' );
		    $api_key = $provider_settings['api_key'] ?? '';

		    if ( empty( $api_key ) ) {
		        return;
		    }

		    try {
		        // Configure SendGrid SMTP
		        $phpmailer->isSMTP();
		        $phpmailer->Host       = 'smtp.sendgrid.net';
		        $phpmailer->SMTPAuth   = true;
		        $phpmailer->Username   = 'apikey';  // SendGrid uses 'apikey' as username
		        $phpmailer->Password   = $api_key;  // API key as password
		        $phpmailer->SMTPSecure = 'tls';
		        $phpmailer->Port       = 587;
		        $phpmailer->Timeout    = 30;

		        // SSL settings for better compatibility
		        $phpmailer->SMTPOptions = array(
		            'ssl' => array(
		                'verify_peer'       => false,
		                'verify_peer_name'  => false,
		                'allow_self_signed' => true,
		            ),
		        );

		        $phpmailer->isHTML(true);
		        $phpmailer->CharSet = 'UTF-8';
		        $phpmailer->Encoding = '8bit';

		        // Add SendGrid specific headers
		        $phpmailer->addCustomHeader('X-Mailer', 'WordPress-SendGrid-Plugin');

				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		        error_log( 'SendGrid SMTP configuration applied successfully' );

		    } catch ( Exception $e ) {
				// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		        error_log( 'SendGrid SMTP configuration error: ' . $e->getMessage() );
		    }
		}

	    if ( $selected_provider ) {
	        // try to set custom From headers if configured
	        $from_email = $this->get_from_email();
	        $from_name  = $this->get_from_name();

	        if ( ! empty( $from_email ) && is_email( $from_email ) ) {
	            try {
	                $phpmailer->setFrom( $from_email, $from_name ? $from_name : get_bloginfo( 'name' ) );
					// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	                error_log( 'PHPMAILER_INIT: Custom from email set: ' . $from_email );
	            } catch ( Exception $e ) {
					// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
	            	error_log( 'PHPMAILER_INIT: Error setting from email: ' . $e->getMessage() );
	            }
	        }
	    }

	}

	/**
	 * Override wp_mail from email
	 */
	public function custom_wp_mail_from( $from_email ) {


		$selected_provider = $this->get_selected_provider() ?? '';

		if ( ! $selected_provider ) {
			return $from_email;
		}

		$custom_from_email = $this->get_from_email() ?? '';

		// Only override if we have a custom from email set
		if ( ! empty( $custom_from_email ) && is_email( $custom_from_email ) ) {
			return $custom_from_email;
		}

		return $from_email;
	}

	/**
	 * Override wp_mail from name
	 */
	public function custom_wp_mail_from_name( $from_name ) {


		$selected_provider = $this->get_selected_provider() ?? '';

		if ( ! $selected_provider ) {
			return $from_name;
		}

		$custom_from_name = $this->get_from_name() ?? '';

		// Only override if we have a custom from name set
		if ( ! empty( $custom_from_name ) ) {
			return $custom_from_name;
		}

		return $from_name;
	}

	/**
	 * Get SMTP configuration status
	 */
	public function get_smtp_status() {

		$selected_provider =  $this->get_selected_provider() ?? '';

		$status = array(
			'provider'        => $selected_provider,
			'from_name'       => $this->get_from_name() ?? '',
			'from_email'      => $this->get_from_email() ?? '',
			'smtp_configured' => false,
			'override_active' => false,
		);

		if ( $selected_provider === 'smtp' ) {
			$smtp_settings             = $this->get_smtp_settings();
			$status['smtp_configured'] = ! empty( $smtp_settings['host'] ) &&
										  ! empty( $smtp_settings['username'] ) &&
										  ! empty( $smtp_settings['password'] );
			$status['override_active'] = $status['smtp_configured'];
		} elseif ( $selected_provider === 'campaign-monitor' ) {
			$provider_settings         = $this->get_provider_settings( 'campaign-monitor' );
			$status['smtp_configured'] = ! empty( $provider_settings['api_key'] ) && ! empty( $provider_settings['client_id'] );
			$status['override_active'] = $status['smtp_configured']; // API integration not implemented yet
		} elseif ( $selected_provider === 'send-in-blue' ) {
			$provider_settings         = $this->get_provider_settings( 'send-in-blue' );
			$status['smtp_configured'] = ! empty( $provider_settings['api_key'] );
			$status['override_active'] = $status['smtp_configured']; // API integration not implemented yet
		} elseif ( $selected_provider === 'mail-jet' ) {
			$provider_settings         = $this->get_provider_settings( 'mail-jet' );
			$status['smtp_configured'] = ! empty( $provider_settings['api_key'] ) && ! empty( $provider_settings['secret_key'] );
			$status['override_active'] = $status['smtp_configured']; // API integration not implemented yet

		} elseif ( $selected_provider === 'moo-send' ) {
			$provider_settings         = $this->get_provider_settings( 'moo-send' );
			$status['smtp_configured'] = ! empty( $provider_settings['api_key'] );
			$status['override_active'] = $status['smtp_configured']; // API integration not implemented yet
		} elseif ( $selected_provider === 'get-response' ) {
			$provider_settings         = $this->get_provider_settings( 'get-response' );
			$status['smtp_configured'] = ! empty( $provider_settings['api_key'] );
			$status['override_active'] = $status['smtp_configured']; // API integration not implemented yet
		}
		elseif ( $selected_provider === 'send-grid' ) {
		    $provider_settings         = $this->get_provider_settings( 'send-grid' );
		    $status['smtp_configured'] = ! empty( $provider_settings['api_key'] );
		    $status['override_active'] = $status['smtp_configured'];
		}

		return $status;
	}
}
