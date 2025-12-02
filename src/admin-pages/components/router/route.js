import { useRouterContext } from './index';

const Route = ( { routeId, children } ) => {
	const { currentPage } = useRouterContext();

	if ( routeId !== currentPage ) {
		return <></>;
	}

	return children;
};

export { Route };
