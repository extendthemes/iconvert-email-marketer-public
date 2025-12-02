<?php

namespace IconvertEmailMarketer\ProvidersAPI\Providers\CampaignMonitor;

// phpcs:ignoreFile


use Exception;
use CS_REST_General;

use IconvertEmailMarketer\ProvidersAPI\Base\Config;
use CS_REST_Wrapper_Result;

use IconvertEmailMarketer\ProvidersAPI\Base\ApiException;
use IconvertEmailMarketer\ProvidersAPI\Base\EmailProviderBase;



class CampaignMonitor extends EmailProviderBase {



	/**
	 * CampaignMonitor constructor.
	 * @param Config $config
	 * @throws ApiException
	 */
	public function __construct( Config $config ) {
		parent::__construct( $config );
		if ( $config->client_id === '' ) {
			$clients = $this->getClients();
			if ( count( $clients ) ) {
				$config->client_id = $clients[0]->ClientID;
			}
			$this->config = $config;
		}

		$this->config = $config;
	}

	/**
	 * normalizeResponse Normalize Response
	 *
	 * @param CS_REST_Wrapper_Result $response
	 * @return array
	 * @throws ApiException
	 */
	public static function normalizeResponse( CS_REST_Wrapper_Result $response ) {
		if ( $response->was_successful() ) {
			return $response->response;
		}
		throw new ApiException( new Exception( $response->response->Message, $response->response->Code ) );
	}

	/**
	 * getAuth Get the authorization key
	 *
	 * @return array API configuration
	 */
	private function getAuth() {
		return array( 'api_key' => $this->config->key );
	}


	/**
	 * getClients Get the clients
	 *
	 * @return array Clients array
	 */
	public function getClients(): array {
		$general_api = new CS_REST_General( $this->getAuth() );
		$response    = self::normalizeResponse( $general_api->get_clients() );
		return $response;
	}


	/**
	 *
	 * @param  ExtendedPHPMailer $phpmailer PHPMailer object
	 * @return boolean True on success, false on failure
	 */
	public function sendTransactionalEmailFromPHPMailer($phpmailer) {
	    try {
	        // Campaign Monitor Classic Email API endpoint - this is the correct one
	        $api_url = 'https://api.createsend.com/api/v3.3/transactional/classicemail/send';

	        // If client_id is provided, add it to the URL
	        if (!empty($this->config->client_id)) {
	            $api_url .= '?clientID=' . urlencode($this->config->client_id);
	        }

	        // Get TO addresses - Campaign Monitor expects array of email strings or "Name <email>" format
	        $to_addresses = [];
	        foreach ($phpmailer->getToAddresses() as $to_item) {
	            if (!empty($to_item[1])) {
	                // Include name if provided
	                $to_addresses[] = $to_item[1] . ' <' . $to_item[0] . '>';
	            } else {
	                $to_addresses[] = $to_item[0];
	            }
	        }

	        if (empty($to_addresses)) {
	            throw new ApiException(new Exception('No recipients specified'));
	        }

	        // Get CC addresses
	        $cc_addresses = [];
	        foreach ($phpmailer->getCcAddresses() as $cc_item) {
	            if (!empty($cc_item[1])) {
	                $cc_addresses[] = $cc_item[1] . ' <' . $cc_item[0] . '>';
	            } else {
	                $cc_addresses[] = $cc_item[0];
	            }
	        }

	        // Get BCC addresses
	        $bcc_addresses = [];
	        foreach ($phpmailer->getBccAddresses() as $bcc_item) {
	            if (!empty($bcc_item[1])) {
	                $bcc_addresses[] = $bcc_item[1] . ' <' . $bcc_item[0] . '>';
	            } else {
	                $bcc_addresses[] = $bcc_item[0];
	            }
	        }

	        // Prepare From address
	        $from_address = $phpmailer->From;
	        if (!empty($phpmailer->FromName)) {
	            $from_address = $phpmailer->FromName . ' <' . $phpmailer->From . '>';
	        }

	        // Handle Reply-To
	        $reply_to = $phpmailer->From; // Default to From address
	        foreach ($phpmailer->getReplyToAddresses() as $reply_to_item) {
	            $reply_to = $reply_to_item[0];
	            break; // Campaign Monitor supports only one reply-to
	        }

	        // Handle attachments
	        $attachments = [];
	        $phpmailer_attachments = $phpmailer->getAttachments();
	        if (!empty($phpmailer_attachments)) {
	            foreach ($phpmailer_attachments as $attachment) {
	                if ($attachment[6] !== 'attachment') {
	                    continue; // Skip inline attachments
	                }

	                $content = '';
	                if (isset($attachment[5]) && $attachment[5] === true) {
	                    $content = $attachment[0]; // String attachment
	                } else {
	                    if (file_exists($attachment[0])) {
	                        $content = file_get_contents($attachment[0]); // File path
	                    } else {
	                        continue; // Skip if file doesn't exist
	                    }
	                }

	                $attachments[] = [
	                    'Name' => $attachment[2] ?? $attachment[1] ?? 'attachment',
	                    'Content' => base64_encode($content),
	                    'Type' => $attachment[4] ?? 'application/octet-stream'
	                ];
	            }
	        }

	        // Prepare email data according to Campaign Monitor Classic Email API
	        $email_data = [
	            'Subject' => $phpmailer->Subject,
	            'From' => $from_address,
	            'ReplyTo' => $reply_to,
	            'To' => $to_addresses,
	            'TrackOpens' => true,
	            'TrackClicks' => true,
	            'InlineCSS' => true,
	            'ConsentToTrack' => 'Yes'
	        ];

	        // Add CC if present
	        if (!empty($cc_addresses)) {
	            $email_data['CC'] = $cc_addresses;
	        }

	        // Add BCC if present
	        if (!empty($bcc_addresses)) {
	            $email_data['BCC'] = $bcc_addresses;
	        }

	        // Handle content based on ContentType
	        if ($phpmailer->ContentType !== 'text/plain') {
	            $email_data['Html'] = $phpmailer->Body;
	            if (!empty($phpmailer->AltBody)) {
	                $email_data['Text'] = $phpmailer->AltBody;
	            }
	        } else {
	            $email_data['Text'] = $phpmailer->Body;
	        }

	        // Add attachments if present
	        if (!empty($attachments)) {
	            $email_data['Attachments'] = $attachments;
	        }

	        // Add a group for tracking (optional)
	        $email_data['Group'] = 'WordPress Plugin';

	        // Prepare request with correct authentication
	        $auth_header = 'Basic ' . base64_encode($this->config->key . ':x');

	        $request_args = [
	            'method' => 'POST',
	            'headers' => [
	                'Authorization' => $auth_header,
	                'Content-Type' => 'application/json',
	                'Accept' => 'application/json'
	            ],
	            'body' => json_encode($email_data),
	            'timeout' => 30,
	            'user-agent' => 'WordPress-ICEM-Plugin/1.0'
	        ];

	        // Send request
	        $response = wp_remote_request($api_url, $request_args);

	        if (is_wp_error($response)) {
	            throw new ApiException(new Exception('Request failed: ' . $response->get_error_message()));
	        }

	        $response_code = wp_remote_retrieve_response_code($response);
	        $response_body = wp_remote_retrieve_body($response);


	        if ($response_code === 202) { // Campaign Monitor returns 202 for successful acceptance
	            return true;
	        } else {
	            $error_message = 'Campaign Monitor API Error: HTTP ' . $response_code;

	            // Try to get more specific error message
	            $decoded_body = json_decode($response_body, true);
	            if (isset($decoded_body['Message'])) {
	                $error_message .= ' - ' . $decoded_body['Message'];
	            } elseif (isset($decoded_body['message'])) {
	                $error_message .= ' - ' . $decoded_body['message'];
	            } elseif (is_array($decoded_body) && !empty($decoded_body)) {
	                // Sometimes errors come as an array
	                $first_error = reset($decoded_body);
	                if (is_array($first_error) && isset($first_error['Message'])) {
	                    $error_message .= ' - ' . $first_error['Message'];
	                }
	            }

	            // Handle common error codes
	            if ($response_code === 400) {
	                $error_message .= ' - Please check your email data and ensure all required fields are provided.';
	            } elseif ($response_code === 401) {
	                $error_message .= ' - Authentication failed. Please check your API key.';
	            } elseif ($response_code === 404) {
	                $error_message .= ' - API endpoint not found. Your account may not have transactional email enabled.';
	            }

	            throw new ApiException(new Exception($error_message));
	        }

	    } catch (Exception $e) {

	        throw new ApiException($e);
	    }
	}

}
