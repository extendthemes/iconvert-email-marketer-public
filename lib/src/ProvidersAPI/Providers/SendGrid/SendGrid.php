<?php

namespace IconvertEmailMarketer\ProvidersAPI\Providers\SendGrid;


use Exception;

use IconvertEmailMarketer\ProvidersAPI\Base\Config;
use IconvertEmailMarketer\ProvidersAPI\Base\ApiException;
use IconvertEmailMarketer\ProvidersAPI\Base\EmailProviderBase;
use  IconvertEmailMarketer\App\Core\Structure\CustomMailer;

class SendGrid extends EmailProviderBase {

    /**
     * @var string SendGrid API base URL
     */
    const API_BASE_URL = 'https://api.sendgrid.com/v3/';

    /**
     * @var string API Key
     */
    private $api_key;

    /**
     * SendGrid constructor
     *
     * @param Config $config
     */
    public function __construct(Config $config) {
        parent::__construct($config);
        $this->api_key = $config->key;
    }

    /**
     * Make HTTP request to SendGrid API
     *
     * @param string $endpoint
     * @param string $method
     * @param array $data
     * @return array
     * @throws ApiException
     */
    private function makeRequest($endpoint, $method = 'GET', $data = null) {
        $url = self::API_BASE_URL . ltrim($endpoint, '/');

        $args = array(
            'method' => $method,
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ),
            'timeout' => 30,
        );

        if ($data !== null && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $args['body'] = json_encode($data);
        }

        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
            throw new ApiException($response->get_error_message(), 0);
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $decoded = json_decode($body, true);

        if ($code >= 400) {
            $message = 'SendGrid API Error: ' . $code;
            if (isset($decoded['errors'][0]['message'])) {
                $message .= ' - ' . $decoded['errors'][0]['message'];
            }
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
            throw new ApiException($message, $code);
        }

        return $decoded ?: array();
    }


    /**
     * Send transactional email from PHPMailer
     *
     * @param ExtendedPHPMailer $phpmailer PHPMailer object
     * @return boolean True on success, false on failure
     */
    public function sendTransactionalEmailFromPHPMailer($phpmailer) {
        try {
            // Build SendGrid email object from PHPMailer object
            $email_data = array(
                'personalizations' => array(
                    array(
                        'to' => array(),
                        'cc' => array(),
                        'bcc' => array(),
                        'subject' => $phpmailer->Subject,
                    )
                ),
                'from' => array(
                    'email' => $phpmailer->From,
                    'name' => $phpmailer->FromName ?: null,
                ),
                'content' => array(),
            );

            // Add TO addresses
            foreach ($phpmailer->getToAddresses() as $to_item) {
                $email_data['personalizations'][0]['to'][] = array(
                    'email' => $to_item[0],
                    'name' => $to_item[1] ?: null,
                );
            }

            // Add CC addresses
            foreach ($phpmailer->getCcAddresses() as $cc_item) {
                $email_data['personalizations'][0]['cc'][] = array(
                    'email' => $cc_item[0],
                    'name' => $cc_item[1] ?: null,
                );
            }

            // Add BCC addresses
            foreach ($phpmailer->getBccAddresses() as $bcc_item) {
                $email_data['personalizations'][0]['bcc'][] = array(
                    'email' => $bcc_item[0],
                    'name' => $bcc_item[1] ?: null,
                );
            }

            // Remove empty arrays
            if (empty($email_data['personalizations'][0]['cc'])) {
                unset($email_data['personalizations'][0]['cc']);
            }
            if (empty($email_data['personalizations'][0]['bcc'])) {
                unset($email_data['personalizations'][0]['bcc']);
            }

            // Add reply-to
            foreach ($phpmailer->getReplyToAddresses() as $reply_to_item) {
                $email_data['reply_to'] = array(
                    'email' => $reply_to_item[0],
                    'name' => $reply_to_item[1] ?: null,
                );
                break; // SendGrid supports only one reply-to
            }

            // Add content
			if ($phpmailer->ContentType !== 'text/plain') {
			    // For HTML emails, add plain text first (if available), then HTML
			    if ($phpmailer->AltBody) {
			        $email_data['content'][] = array(
			            'type' => 'text/plain',
			            'value' => $phpmailer->AltBody,
			        );
			    }
			    $email_data['content'][] = array(
			        'type' => 'text/html',
			        'value' => $phpmailer->Body,
			    );
			} else {
			    // For plain text only emails
			    $email_data['content'][] = array(
			        'type' => 'text/plain',
			        'value' => $phpmailer->Body,
			    );
			}

            // Add attachments
            $phpmailer_attachments = $phpmailer->getAttachments();
            if (!empty($phpmailer_attachments)) {
                $email_data['attachments'] = array();
                foreach ($phpmailer_attachments as $attachment) {
                    if ($attachment[6] !== 'attachment') {
                        continue; // Only support attachments, not inline
                    }

                    $content = '';
                    if (isset($attachment[5]) && $attachment[5] === true) {
                        $content = $attachment[0];
                    } else {
                        $content = file_get_contents($attachment[0]);
                    }

                    $email_data['attachments'][] = array(
                        'content' => base64_encode($content),
                        'type' => $attachment[4] ?: 'application/octet-stream',
                        'filename' => $attachment[2] ?: $attachment[1] ?: 'attachment',
                        'disposition' => 'attachment',
                    );
                }
            }

            // Add custom headers
            $custom_headers = $phpmailer->getCustomHeaders();
            if (!empty($custom_headers)) {
                $email_data['headers'] = array();
                foreach ($custom_headers as $header) {
                    $email_data['headers'][$header[0]] = $header[1];
                }
            }

            // Send via SendGrid API
            $this->makeRequest('mail/send', 'POST', $email_data);
            return true;

        } catch (Exception $e) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
            $this->throwNormalizeException($e);
            return false;
        }
    }

    /**
     * Normalize and throw exceptions
     *
     * @param Exception $e
     * @return void
     * @throws ApiException
     */
    public function throwNormalizeException(Exception $e) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
        throw new ApiException($e->getMessage(), $e->getCode(), $e->getPrevious());
    }
}
