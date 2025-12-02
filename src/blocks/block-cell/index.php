<?php

namespace  IconvertEmailMarketer\App\Core\Blocks;

use  IconvertEmailMarketer\App\Core\Blocks\BaseBlock;
use  IconvertEmailMarketer\App\Core\Blocks\BlockRegistry;

class CellBlock extends BaseBlock {

	public function html() {
		ob_start();
		?>
		<td class="wp-block-extendstudio-cell" width="<?php echo esc_attr($this->calculateWidth()); ?>" style="<?php echo esc_attr($this->styles['_style']->css()); ?>">
			<inner-blocks></inner-blocks>
		</td>
		<?php

		return ob_get_clean();
	}
}

BlockRegistry::register( __DIR__, CellBlock::class );
