import { Fragment } from '@wordpress/element';
import { Component } from "./component";
import { IconvertInspector } from "./inspector";

export default function Link({	attributes,	setAttributes }) {
	const commonProps = {attributes: attributes, setAttributes: setAttributes};

	return (
		<Fragment>
			<IconvertInspector {...commonProps}/>
			<Component {...commonProps}/>
		</Fragment>
	);
}
