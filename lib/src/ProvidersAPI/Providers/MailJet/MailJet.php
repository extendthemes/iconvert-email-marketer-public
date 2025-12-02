<?php

namespace IconvertEmailMarketer\ProvidersAPI\Providers\MailJet;

//phpcs:ignoreFile

use Exception;
use Mailjet\Client;
use IconvertEmailMarketer\ProvidersAPI\Base\Config;

use IconvertEmailMarketer\ProvidersAPI\Base\EmailProviderBase;


class MailJet extends EmailProviderBase {



	/**
	 * MailJet __construct
	 *
	 * @param  mixed $config
	 * @return void
	 */
	public function __construct( Config $config ) {
		parent::__construct( $config );

		$this->client = $this->clientActions( $config );
	}

	/**
	 * clientActions API client initialization
	 *
	 * @param  mixed $config
	 * @return array API client
	 */
	private function clientActions( Config $config ) {
		return new Client( $config->client_id, $config->key, true, array( 'version' => 'v3' ) );
	}



	/**
	 * Send transactional email from PHPMailer using MailJet Send API v3.1
	 *
	 * @param mixed $phpmailer PHPMailer object
	 * @return boolean True on success, false on failure
	 */
	public function sendTransactionalEmailFromPHPMailer($phpmailer)
	{
	    try {

	        // Validate required fields
	        if (empty($phpmailer->From)) {
	            throw new Exception('From email is required');
	        }

	        if (empty($phpmailer->Subject)) {
	            throw new Exception('Subject is required');
	        }

	        // Prepare recipients with better compatibility checking
	        $to_addresses = [];
	        $to_recipients = method_exists($phpmailer, 'getToAddresses') ?
	            $phpmailer->getToAddresses() :
	            $this->extractRecipientsFromPHPMailer($phpmailer, 'to');

	        foreach ($to_recipients as $to_item) {
	            $to_addresses[] = [
	                'Email' => $to_item[0],
	                'Name'  => isset($to_item[1]) && !empty($to_item[1]) ? $to_item[1] : null,
	            ];
	        }

	        if (empty($to_addresses)) {
	            throw new Exception('At least one recipient is required');
	        }

	        // Prepare CC recipients
	        $cc_addresses = [];
	        $cc_recipients = method_exists($phpmailer, 'getCcAddresses') ?
	            $phpmailer->getCcAddresses() :
	            $this->extractRecipientsFromPHPMailer($phpmailer, 'cc');

	        foreach ($cc_recipients as $cc_item) {
	            $cc_addresses[] = [
	                'Email' => $cc_item[0],
	                'Name'  => isset($cc_item[1]) && !empty($cc_item[1]) ? $cc_item[1] : null,
	            ];
	        }

	        // Prepare BCC recipients
	        $bcc_addresses = [];
	        $bcc_recipients = method_exists($phpmailer, 'getBccAddresses') ?
	            $phpmailer->getBccAddresses() :
	            $this->extractRecipientsFromPHPMailer($phpmailer, 'bcc');

	        foreach ($bcc_recipients as $bcc_item) {
	            $bcc_addresses[] = [
	                'Email' => $bcc_item[0],
	                'Name'  => isset($bcc_item[1]) && !empty($bcc_item[1]) ? $bcc_item[1] : null,
	            ];
	        }

	        // Prepare attachments with improved error handling
	        $attachments = [];
	        $phpmailer_attachments = method_exists($phpmailer, 'getAttachments') ?
	            $phpmailer->getAttachments() : [];

	        if (!empty($phpmailer_attachments)) {
	            foreach ($phpmailer_attachments as $attachment) {
	                try {
	                    // Skip inline attachments (embedded images, etc.)
	                    if (isset($attachment[6]) && $attachment[6] !== 'attachment') {
	                        continue;
	                    }

	                    $content = '';
	                    $filename = '';
	                    $content_type = 'application/octet-stream';

	                    // Handle string vs file attachments
	                    if (isset($attachment[5]) && $attachment[5] === true) {
	                        // String attachment
	                        $content = $attachment[0];
	                        $filename = isset($attachment[2]) ? $attachment[2] :
	                                   (isset($attachment[1]) ? $attachment[1] : 'attachment');
	                    } else {
	                        // File path attachment
	                        if (!file_exists($attachment[0])) {
	                            continue;
	                        }
	                        $content = file_get_contents($attachment[0]);
	                        $filename = isset($attachment[2]) ? $attachment[2] : basename($attachment[0]);
	                    }

	                    // Get content type
	                    if (isset($attachment[4]) && !empty($attachment[4])) {
	                        $content_type = $attachment[4];
	                    }

	                    if (!empty($content)) {
	                        $attachments[] = [
	                            'ContentType' => $content_type,
	                            'Filename' => $filename,
	                            'Base64Content' => base64_encode($content),
	                        ];
	                    }
	                } catch (Exception $e) {

	                    // Continue with other attachments
	                }
	            }
	        }

	        // Build MailJet Send API v3.1 message
	        $message = [
	            'From' => [
	                'Email' => $phpmailer->From,
	                'Name' => !empty($phpmailer->FromName) ? $phpmailer->FromName : null,
	            ],
	            'To' => $to_addresses,
	            'Subject' => $phpmailer->Subject,
	        ];

	        // Add CC and BCC if they exist
	        if (!empty($cc_addresses)) {
	            $message['Cc'] = $cc_addresses;
	        }
	        if (!empty($bcc_addresses)) {
	            $message['Bcc'] = $bcc_addresses;
	        }

	        // Set content based on ContentType with fallback
	        $content_type = isset($phpmailer->ContentType) ? $phpmailer->ContentType : 'text/plain';

	        if ($content_type !== 'text/plain' && !empty($phpmailer->Body)) {
	            $message['HTMLPart'] = $phpmailer->Body;
	            if (!empty($phpmailer->AltBody)) {
	                $message['TextPart'] = $phpmailer->AltBody;
	            }
	        } else {
	            $message['TextPart'] = !empty($phpmailer->Body) ? $phpmailer->Body : '';
	        }

	        // Add Reply-To if exists with better compatibility
	        $reply_to_addresses = method_exists($phpmailer, 'getReplyToAddresses') ?
	            $phpmailer->getReplyToAddresses() : [];

	        if (!empty($reply_to_addresses)) {
	            $first_reply_to = reset($reply_to_addresses);
	            $message['ReplyTo'] = [
	                'Email' => $first_reply_to[0],
	                'Name' => isset($first_reply_to[1]) && !empty($first_reply_to[1]) ? $first_reply_to[1] : null,
	            ];
	        }

	        // Add attachments if they exist
	        if (!empty($attachments)) {
	            $message['Attachments'] = $attachments;
	        }

	        // FIXED: Don't add custom headers that MailJet doesn't allow
	        // Only add safe custom headers
	        $custom_headers = method_exists($phpmailer, 'getCustomHeaders') ?
	            $phpmailer->getCustomHeaders() : [];

	        if (!empty($custom_headers)) {
	            $headers = [];
	            $forbidden_headers = ['X-Mailjet-Campaign', 'X-MJ-Campaign']; // Headers MailJet doesn't allow

	            foreach ($custom_headers as $header) {
	                if (is_array($header) && count($header) >= 2) {
	                    $header_name = $header[0];
	                    $header_value = $header[1];

	                    // Skip forbidden headers
	                    if (!in_array($header_name, $forbidden_headers)) {
	                        $headers[$header_name] = $header_value;
	                    }
	                }
	            }

	            if (!empty($headers)) {
	                $message['Headers'] = $headers;
	            }
	        }

	        // Create the body for the Send API v3.1
	        $body = [
	            'Messages' => [$message]
	        ];


	        // Use direct HTTP call instead of Resources::$Send
	        $api_url = 'https://api.mailjet.com/v3.1/send';
	        $auth_string = base64_encode($this->config->client_id . ':' . $this->config->key);

	        $http_args = [
	            'headers' => [
	                'Authorization' => 'Basic ' . $auth_string,
	                'Content-Type' => 'application/json',
	            ],
	            'body' => json_encode($body),
	            'timeout' => 30,
	            'method' => 'POST'
	        ];


	        $http_response = wp_remote_post($api_url, $http_args);

	        if (is_wp_error($http_response)) {
	            throw new Exception('HTTP request failed: ' . $http_response->get_error_message());
	        }

	        $response_code = wp_remote_retrieve_response_code($http_response);
	        $response_body = wp_remote_retrieve_body($http_response);


	        if ($response_code === 200) {
	            $response_data = json_decode($response_body, true);

	            // Check for successful messages in response
	            if (isset($response_data['Messages']) && !empty($response_data['Messages'])) {
	                foreach ($response_data['Messages'] as $msg) {
	                    if (isset($msg['Status']) && $msg['Status'] === 'success') {
	                        return true;
	                    }
	                }
	            }

	            // If we get here, check for errors in the response
	            if (isset($response_data['Messages']) && !empty($response_data['Messages'])) {
	                $first_message = $response_data['Messages'][0];
	                if (isset($first_message['Errors']) && !empty($first_message['Errors'])) {
	                    $errors = [];
	                    foreach ($first_message['Errors'] as $error) {
	                        $errors[] = $error['ErrorMessage'] ?? 'Unknown error';
	                    }
	                    throw new Exception('MailJet API Errors: ' . implode(', ', $errors));
	                }
	            }

	            throw new Exception('MailJet API: Unexpected response format');
	        } else {
	            // Parse error response for better error messages
	            $error_message = 'MailJet API HTTP Error: ' . $response_code;

	            if (!empty($response_body)) {
	                $error_data = json_decode($response_body, true);
	                if (isset($error_data['Messages']) && !empty($error_data['Messages'])) {
	                    $first_message = $error_data['Messages'][0];
	                    if (isset($first_message['Errors']) && !empty($first_message['Errors'])) {
	                        $errors = [];
	                        foreach ($first_message['Errors'] as $error) {
	                            $errors[] = $error['ErrorMessage'] ?? 'Unknown error';
	                        }
	                        $error_message .= ' - ' . implode(', ', $errors);
	                    }
	                } else {
	                    $error_message .= ' - ' . $response_body;
	                }
	            }

	            throw new Exception($error_message);
	        }

	    } catch (Exception $e) {


	        // FIXED: Don't try to call protected setError method
	        // The error will be handled by the calling code

	        return false;
	    }
	}

	/**
	 * Fallback method to extract recipients when getXXXAddresses methods don't exist
	 *
	 * @param object $phpmailer PHPMailer instance
	 * @param string $type 'to', 'cc', or 'bcc'
	 * @return array Recipients array
	 */
	private function extractRecipientsFromPHPMailer($phpmailer, $type)
	{
	    $recipients = [];

	    try {
	        switch ($type) {
	            case 'to':
	                if (isset($phpmailer->to) && is_array($phpmailer->to)) {
	                    foreach ($phpmailer->to as $to) {
	                        $recipients[] = [$to[0], isset($to[1]) ? $to[1] : ''];
	                    }
	                }
	                break;

	            case 'cc':
	                if (isset($phpmailer->cc) && is_array($phpmailer->cc)) {
	                    foreach ($phpmailer->cc as $cc) {
	                        $recipients[] = [$cc[0], isset($cc[1]) ? $cc[1] : ''];
	                    }
	                }
	                break;

	            case 'bcc':
	                if (isset($phpmailer->bcc) && is_array($phpmailer->bcc)) {
	                    foreach ($phpmailer->bcc as $bcc) {
	                        $recipients[] = [$bcc[0], isset($bcc[1]) ? $bcc[1] : ''];
	                    }
	                }
	                break;
	        }
	    } catch (Exception $e) {
	    }

	    return $recipients;
	}

}
