import { RouterContextWrapper } from '../components/router';
import { PAGES_ROUTES_LIST } from '../pages';
import { Route } from '../components/router/route';
import { PluginDataContextWrapper } from '@iconvertem/admin-pages/core/hooks';
import { DisplayNotices } from '@iconvertem/admin-pages/core/notices/display-notices';

const App = () => {
	return (
		<PluginDataContextWrapper>
			<DisplayNotices />
			<RouterContextWrapper>
				{PAGES_ROUTES_LIST.map(({ path, Component }) => {
					return (
						<Route key={path} routeId={path}>
							<Component />
						</Route>
					);
				})}
			</RouterContextWrapper>
		</PluginDataContextWrapper>
	);
};

export { App };
