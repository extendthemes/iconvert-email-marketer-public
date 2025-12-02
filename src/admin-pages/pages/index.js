import { PAGES } from '../components/router/constants';

import { TransactionalEmailsPage } from './transactional-emails-page';
import { NewsletterEmailsPage } from './newsletter-emails-page';
import { EmailLogPage } from './email-log-page';
import { SendingSettingsPage } from './sending-settings-page';
import { UpgradeToProPage } from './upgrade-to-pro-page';
const PAGES_ROUTES_LIST = [
	{
		path: PAGES.TRANSACTIONAL_EMAILS,
		Component: TransactionalEmailsPage,
	},
	{
		path: PAGES.NEWSLETTERS,
		Component: NewsletterEmailsPage,
	},
	{
		path: PAGES.SENDING_SETTINGS,
		Component: SendingSettingsPage,
	},
	{
		path: PAGES.EMAIL_LOG,
		Component: EmailLogPage,
	},
	{
		path: PAGES.UPGRADE_TO_PRO,
		Component: UpgradeToProPage,
	},
];
export { PAGES_ROUTES_LIST };
