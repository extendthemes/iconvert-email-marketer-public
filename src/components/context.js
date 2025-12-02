import { createContext, useContext } from '@wordpress/element';

const RichTextContext = createContext({});
const useRichTextContext = () => {
    return useContext(RichTextContext);
};

export { RichTextContext, useRichTextContext };