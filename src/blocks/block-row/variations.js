/**
 * WordPress dependencies
 */
const { Path, SVG } = wp.components;
const { __ } = wp.i18n;

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'one-column-full',
		title: __( '100' ),
		description: __( 'One column' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
				/>
			</SVG>
		),
		innerBlocks: [ [ 'extendstudio/cell' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-equal',
		title: __( '50 / 50' ),
		description: __( 'Two columns; equal split' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z"
				/>
			</SVG>
		),
		isDefault: true,
		innerBlocks: [
			[ 'extendstudio/cell', { width: '49.99%' } ],
			[ 'extendstudio/cell', { width: '49.99%' } ]
		],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns-equal',
		title: __( '33 / 33 / 33' ),
		description: __( 'Three columns; equal split' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM28.5 34h-9V14h9v20zm2 0V14H39v20h-8.5zm-13 0H9V14h8.5v20z"
				/>
			</SVG>
		),
		innerBlocks: [
			[ 'extendstudio/cell', { width: '33.33%' } ],
			[ 'extendstudio/cell', { width: '33.33%' } ],
			[ 'extendstudio/cell', { width: '33.33%' } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'four-columns-equal',
		title: __( '4 X 25' ),
		description: __( 'Four columns; equal split' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					d="m 41,14 c 0,-1.104569 -0.895431,-2 -2,-2 H 9 c -1.1045695,0 -2,0.895431 -2,2 v 20 c 0,1.104569 0.8954305,2 2,2 h 30 c 1.104569,0 2,-0.895431 2,-2 z M 23,34 h -6 l 0,-20 h 6 z m 2,0 V 14 H 39 V 34 Z M 15,34 H 8.8262967 L 9,14 h 6 z"
					/>
				<Path
					d="M 31,34 V 14 h 2 v 20 z"
					id="path503" />
			</SVG>

		),
		innerBlocks: [
			[ 'extendstudio/cell', { width: '25%' } ],
			[ 'extendstudio/cell', { width: '25%' } ],
			[ 'extendstudio/cell', { width: '25%' } ],
			[ 'extendstudio/cell', { width: '25%' } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-one-third-two-thirds',
		title: __( '30 / 70' ),
		description: __( 'Two columns; one-third, two-thirds split' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z"
				/>
			</SVG>
		),
		innerBlocks: [
			[ 'extendstudio/cell', { width: '33.33%' } ],
			[ 'extendstudio/cell', { width: '66.66%' } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-two-thirds-one-third',
		title: __( '70 / 30' ),
		description: __( 'Two columns; two-thirds, one-third split' ),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H30V34H39ZM28 34H9V14H28V34Z"
				/>
			</SVG>
		),
		innerBlocks: [
			[ 'extendstudio/cell', { width: '66.66%' } ],
			[ 'extendstudio/cell', { width: '33.33%' } ],
		],
		scope: [ 'block' ],
	},
];

export default variations;
