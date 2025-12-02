import { createBlock } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function AppendAddButton() {
	const { insertBlock, selectBlock } = useDispatch('core/block-editor');
	const { setIsInserterOpened } = useDispatch('ic/edit-mail');
	const { getBlocks } = useSelect((select) => {
		return select('core/block-editor');
	}, []);
	const createRowBlock = () => {
		const blocks = getBlocks();
		const mailContainerBlock = blocks.find(
			(block) => block.name === 'extendstudio/mail-container'
		);
		if (!mailContainerBlock) {
			return;
		}

		const rowBlock = createBlock('extendstudio/row');
		insertBlock(
			rowBlock,
			mailContainerBlock.innerBlocks.length,
			mailContainerBlock.clientId
		);
	};

	// const insertPredesign = () => {
	// 	selectBlock(null);
	// 	setIsInserterOpened(true).then(() => {
	// 		setTimeout(() => {
	// 			document
	// 				.querySelector(
	// 					'.components-tab-panel__tabs button[id*=patterns]'
	// 				)
	// 				?.click?.();
	// 		}, 0);
	// 	});
	// };

	const renderButton = () => {
		return (
			<div
				id={'section-insert'}
				style={{
					backgroundColor: '#ededed',
					fontSize: '13px',
					padding: '60px 0',
					float: 'none',
					clear: 'both',
				}}
			>
				<div
					className={'insert-options-container'}
					style={{
						width: '100%',
						position: 'relative',
						backgroundColor: '#fff',
						border: '2px dotted #31b1df',
						padding: '40px 0',
						maxWidth: '1200px',
						margin: 'auto',
					}}
				>
					<div
						className={'insert-options d-flex'}
						style={{ justifyContent: 'center', gap: '10px' }}
					>
						<Button
							type={'button'}
							className={'components-button is-primary'}
							onClick={createRowBlock}
						>
							{__('Add blank row', 'iconvert-email-marketer')}
						</Button>
					</div>
				</div>
			</div>
		);
	};
	return renderButton();
}
