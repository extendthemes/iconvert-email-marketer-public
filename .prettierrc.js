// Import the default config file and expose it in the project root.
// Useful for editor integrations.
const prettierDefault = require('@wordpress/prettier-config');

//use a different config file for json to be the same with the majority of json styling. So we don't redo all the files
const prettierConfig = {
	...prettierDefault,
};
try {
	delete prettierConfig.bracketSameLine;
} catch (e) {}
module.exports = prettierConfig;
