import { createContext, useContext } from '@wordpress/element';
const OwnerDocumentContext = createContext();
const useBlocksOwnerDocument = () => useContext(OwnerDocumentContext);

export { OwnerDocumentContext, useBlocksOwnerDocument };
