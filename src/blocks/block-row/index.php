<?php

namespace  IconvertEmailMarketer\App\Core\Blocks;


class RowBlock extends BaseBlock {

	public function html() {

		$isStackedOnMobile = $this->getAttribute( 'isStackedOnMobile', false );
		$max_width         = $this->getMaxWidth();
		$width_attr        = "{$max_width['value']}{$max_width['unit']}";
		ob_start();

		$table_class = $isStackedOnMobile == 1 ? 'row-content stack' : 'row-content';
		?>
		<table class="block-row" align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0 auto 0 auto; width: 100%;  min-width:100%; <?php echo esc_attr($this->styles['_block']->css()); ?>">
			<tbody>
				<tr>
					<td>
						<table class="<?php echo esc_attr( $table_class ); ?>" align="center" width="<?php echo esc_attr( $width_attr ); ?>" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0 auto 0 auto; width: 100%;  <?php echo esc_attr($this->calculateWidthAndMaxWidth()); ?> <?php echo esc_attr($this->styles['_style']->css()); ?>">
							<tbody>
								<tr>
									<inner-blocks></inner-blocks>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<?php

		return ob_get_clean();
	}
}

BlockRegistry::register( __DIR__, RowBlock::class );
