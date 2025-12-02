import { createContext, useContext } from "@wordpress/element";

const Context = createContext();

const usePostProviderContext = () => useContext(Context);

const PostProvider = ({ value, children }) => {
	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { PostProvider, usePostProviderContext };
