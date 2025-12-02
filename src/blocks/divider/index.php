<?php

namespace  IconvertEmailMarketer\App\Core\Blocks;

use  IconvertEmailMarketer\App\Core\Blocks\BaseBlock;
use  IconvertEmailMarketer\App\Core\Blocks\BlockRegistry;

class DividerBlock extends BaseBlock {

	public function html() {
		ob_start();
		?>
		<table className="divider_block" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
			<tbody>
				<tr>
					<td valign="top" style="<?php echo esc_attr($this->styles['_block']->css()); ?>">
						<div align="<?php echo esc_attr($this->styles['_block']->getProperty( 'textAlign' )); ?>">
							<table border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
								<tbody>
									<tr>
										<td style="line-height: 1px; font-size: 1px; <?php echo esc_attr($this->styles['_style']->css()); ?>">
											<span>&nbsp;</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<?php

		return ob_get_clean();
	}
}

BlockRegistry::register( __DIR__, DividerBlock::class );
