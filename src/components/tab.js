import { TabPanel } from '@wordpress/components';

const Tab = ({ tabs }) => {
	return (
		<TabPanel className="iconvertem-editing-tab" tabs={tabs}>
			{(tab) => <>{tab.component}</>}
		</TabPanel>
	);
};

export { Tab };
