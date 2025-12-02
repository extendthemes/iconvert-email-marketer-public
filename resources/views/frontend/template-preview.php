<?php

use IconvertEmailMarketer\App\Core\Frontend\MailContainerTableFrontendCss;
use IconvertEmailMarketer\App\Core\Structure\EmailTemplateCPT;
use  IconvertEmailMarketer\App\Core\Structure\EmailTemplateSettings;



$iconvertem_email_settings     = EmailTemplateSettings::getInstance();
$iconvertem_email_campaign = $iconvertem_email_settings->get( 'email_campaign' );
$iconvertem_template_id = $iconvertem_email_settings->get( 'template_id' );
$iconvertem_email_template = $iconvertem_email_settings->get( 'ic_email_template' );
if(empty($iconvertem_email_template)) {
	global $post;
	$iconvertem_email_template = $post;
}

if(empty($iconvertem_email_template) || (!empty($iconvertem_email_template) && $iconvertem_email_template->post_type !== EmailTemplateCPT::POST_TYPE)) {
	wp_safe_redirect( home_url( '/mail-template-not-found/' ), 302 );
	exit;
}

$iconvertem_use_real_data     = $iconvertem_email_settings->get( 'use_real_data', false );
$iconvertem_mail_container_table_css  = MailContainerTableFrontendCss::getCss($iconvertem_email_template);
$iconvertem_has_email_container_block = str_contains( $iconvertem_email_template->post_content, 'extendstudio/mail-container' );

$iconvertem_mail_rendered_content = '';

if ( trim( $iconvertem_email_template->post_content ) != '' ) {
	$iconvertem_mail_rendered_content =  apply_filters( 'iconvertem_parse_content', do_blocks( $iconvertem_email_template->post_content ), ! ! $iconvertem_use_real_data );;
} else {
	$iconvertem_mail_rendered_content = __( 'Please setup your email template.', 'iconvert-email-marketer' );
}
ob_start();
?>
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <style>

            <?php
            	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            	echo file_get_contents( ICONVERTEM_PATH . 'admin/assets/css/mail-template.css' );
			?>



		</style>
		<style>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo file_get_contents( ICONVERTEM_PATH . 'admin/assets/fonts/font-faces/css/style.css' );
			?>
		</style>
    </head>

    <body>
	<center>
	<?php

	if($iconvertem_has_email_container_block) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $iconvertem_mail_rendered_content;
	}

	if(!$iconvertem_has_email_container_block): ?>
		<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"
			   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; <?php echo esc_attr($iconvertem_mail_container_table_css); ?>>
			<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
						   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%">
						<tbody>
						<tr>
							<td>
								<?php
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo $iconvertem_mail_rendered_content;
								?>
							</td>
						</tr>
						</tbody>
					</table>
				</td>

			</tr>
			</tbody>
		</table>
	<?php
	endif;
	?>
	</center>
    </body>

    </html>


<?php

$iconvertem_content = ob_get_clean();
$iconvertem_content = iconvertem_minify_html( $iconvertem_content );
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
echo $iconvertem_content;
