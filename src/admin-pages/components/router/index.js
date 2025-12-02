import {
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { PAGES } from './constants';

const RouterContext = createContext({});

const RouterContextWrapper = memo(({ children }) => {
	const getHashIfSupportedPage = (hash) => {
		const availablePages = Object.values(PAGES);
		const currentHash = window.location.hash.replace('#', '');
		return availablePages.includes(currentHash);
	};
	const defaultHash = useMemo(() => {
		const currentHash = window.location.hash.replace('#', '');
		if (getHashIfSupportedPage(currentHash)) {
			return currentHash;
		}
		return PAGES.TRANSACTIONAL_EMAILS;
	}, []);
	const [currentPage, setCurrentPageInternal] = useState(defaultHash);

	useEffect(() => {
		onUpdateAdminPageActiveClass(currentPage);
	}, []);
	const setCurrentPage = useCallback((newHash) => {
		if (getHashIfSupportedPage(newHash)) {
			onUpdateAdminPageActiveClass(newHash);
			setCurrentPageInternal(newHash);
		}
	}, []);

	useEffect(() => {
		const onHashChange = () => {
			const newHash = window.location.hash.replace('#', '');
			if (getHashIfSupportedPage(newHash)) {
				setCurrentPage(newHash);
			}
		};
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);
	const contextValue = useMemo(() => {
		return {
			currentPage,
			setCurrentPage,
		};
	}, [currentPage]);

	return (
		<RouterContext.Provider value={contextValue}>
			{children}
		</RouterContext.Provider>
	);
});

const onUpdateAdminPageActiveClass = (page) => {
	const menu = document.querySelector(
		'#toplevel_page_iconvertem .wp-submenu'
	);
	if (!menu) {
		return;
	}
	const activeClass = 'current';
	const menuItemsLi = [...menu.querySelectorAll('li')];
	menuItemsLi.forEach((node) => {
		node.classList.remove(activeClass);
	});

	const currentActiveLi = menuItemsLi.find((li) => {
		const aNode = li.querySelector('a');
		if (!aNode) {
			return false;
		}
		const href = aNode.getAttribute('href');
		return href.includes(page);
	});
	if (!currentActiveLi) {
		return;
	}
	currentActiveLi.classList.add(activeClass);
};
const useRouterContext = () => {
	return useContext(RouterContext);
};
export { RouterContextWrapper, useRouterContext };
