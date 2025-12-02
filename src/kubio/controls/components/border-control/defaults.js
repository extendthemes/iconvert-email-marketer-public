const borderDefault = {
	default: {
		top: {
			width: {
				value: '',
				unit: 'px',
			},
			style: 'none',
			color: '',
			radius: {
				left: {
					value: '',
					unit: 'px',
				},
				right: {
					value: '',
					unit: 'px',
				},
			},
		},
		right: {
			width: {
				value: '',
				unit: 'px',
			},
			style: 'none',
			color: '',
		},
		bottom: {
			width: {
				value: '',
				unit: 'px',
			},
			style: 'none',
			color: '',
			radius: {
				left: {
					value: '',
					unit: 'px',
				},
				right: {
					value: '',
					unit: 'px',
				},
			},
		},
		left: {
			width: {
				value: '',
				unit: 'px',
			},
			style: 'none',
			color: '',
		},
	},
	radiusMap: {
		'border-top-left-radius': 'top.radius.left',
		'border-top-right-radius': 'top.radius.right',
		'border-bottom-left-radius': 'bottom.radius.left',
		'border-bottom-right-radius': 'bottom.radius.right',
	},
};

export { borderDefault };
