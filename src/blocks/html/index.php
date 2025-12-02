<?php

namespace  IconvertEmailMarketer\App\Core\Blocks;

use  IconvertEmailMarketer\App\Core\Blocks\BaseBlock;
use  IconvertEmailMarketer\App\Core\Blocks\BlockRegistry;

class HTMLBlock extends BaseBlock {

	public function html() {
		ob_start();
		?>
		<?php echo wp_kses_post($this->content); ?>
		<?php

		return ob_get_clean();
	}
}

BlockRegistry::register( __DIR__, HTMLBlock::class );
