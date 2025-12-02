import { MediaUploadCheck } from '@wordpress/block-editor';
import { MediaUpload } from '@wordpress/media-utils';
import { BaseControl, Button, FocalPointPicker } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { transform } from 'lodash';
import { __ } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';

const FocalPointMediaPicker = ({
	url = '',
	focalPoint = { x: 0, y: 100 },
	types = ['image'],
	onChange,
	autoPlay = false,
	label = false,
	showButton = true,
	openMediaLabel = __('Change background image', 'kubio'),
}) => {
	const [state, setState] = useState({
		url,
		focalPoint: transform(focalPoint, (acc, coordValue, coord) => {
			acc[coord] = coordValue / 100;
		}),
	});

	useEffect(() => {
		setState({
			url,
			focalPoint: transform(focalPoint, (acc, coordValue, coord) => {
				acc[coord] = coordValue / 100;
			}),
		});
	}, [url, focalPoint, setState]);

	const onChangeCallback = useCallback(
		({ url: nextUrl, focalPoint: nextFocalPoint }) => {
			nextFocalPoint = transform(
				nextFocalPoint,
				(acc, coordValue, coord) => {
					acc[coord] = parseInt(coordValue * 100);
				}
			);

			onChange({ url: nextUrl, focalPoint: nextFocalPoint });
		},
		[transform, onChange]
	);

	// eslint-disable-next-line no-shadow
	const delayedOnChange = useDebounce(onChangeCallback, 100);

	const onMediaSelect = (media) => {
		const newState = {
			...state,
			url: media.url,
		};

		setState(newState);

		delayedOnChange(newState);
	};

	const onFocalPointChange = (newFocalPoint) => {
		const newState = {
			...state,
			focalPoint: newFocalPoint,
		};
		setState(newState);
		delayedOnChange(newState);
	};

	return (
		<MediaUploadCheck className="kubio-control">
			<MediaUpload
				onSelect={onMediaSelect}
				allowedTypes={types}
				render={({ open }) => (
					<>
						{state.url && (
							<FocalPointPicker
								autoPlay={autoPlay}
								url={state.url}
								value={state.focalPoint}
								onChange={onFocalPointChange}
								onDrag={onFocalPointChange}
								label={label}
							/>
						)}
						{showButton && (
							<BaseControl>
								<Button
									className={'kubio-button-100'}
									isPrimary
									onClick={open}
								>
									{label ? label : openMediaLabel}
								</Button>
							</BaseControl>
						)}
					</>
				)}
			/>
		</MediaUploadCheck>
	);
};

export default FocalPointMediaPicker;
