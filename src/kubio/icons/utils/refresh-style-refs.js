import { isArray, get, set } from 'lodash';
import generateShortID from 'shortid';
import { isGutentagPrefixed } from './is-gutentag-prefixed';

const walker = (block, keepLinkedStyleRefs, linkedRefs) => {
	let name, attributes, innerBlocks;

	if (isArray(block)) {
		[name, attributes, innerBlocks] = block;
	} else {
		attributes = block?.attributes;
		innerBlocks = block?.innerBlocks;
	}

	name = name || block?.name;

	if (!isGutentagPrefixed(name)) {
		if (isArray(block)) {
			return [name, newAttributes, newInnerBlocks];
		}
		return block;
	}

	const currentStyleRef = get(attributes, 'kubio.styleRef', null);
	let nextStyleRef = generateShortID();

	if (currentStyleRef && keepLinkedStyleRefs) {
		nextStyleRef = get(
			linkedRefs,
			`${currentStyleRef}.value`,
			generateShortID()
		);

		const hits = get(linkedRefs, `${currentStyleRef}.hits`, 0);

		linkedRefs = set(linkedRefs, currentStyleRef, {
			value: nextStyleRef,
			hits: hits + 1, // this is for debug only
		});
	}

	const newAttributes = {
		...attributes,
		kubio: {
			...attributes?.kubio,
			styleRef: nextStyleRef,
			hash: generateShortID(),
		},
	};

	const newInnerBlocks = (innerBlocks || []).map((innerBlock) =>
		walker(innerBlock, keepLinkedStyleRefs, linkedRefs)
	);

	if (isArray(block)) {
		return [name, newAttributes, newInnerBlocks];
	}
	return {
		...block,
		attributes: newAttributes,
		innerBlocks: newInnerBlocks,
	};
};

const refreshBlockStyleRefs = (block, keepLinkedStyleRefs = true) => {
	const linkedRefs = {};
	return walker(block, keepLinkedStyleRefs, linkedRefs);
};

export { refreshBlockStyleRefs };
