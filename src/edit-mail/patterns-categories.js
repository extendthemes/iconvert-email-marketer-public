const patternsCategories = [
	{
		name: 'newsletters-photo-blog',
		label: 'Newsletters photo blog',
	},
	{
		name: 'newsletters-sweets',
		label: 'Newsletters sweets',
	},
	{
		name: 'newsletters-electronics',
		label: 'Newsletters electronics',
	},
	{
		name: 'newsletters-cosmetics',
		label: 'Newsletters cosmetics',
	},
	{
		name: 'welcome-new-account',
		label: 'Welcome new account',
	},
	{
		name: 'events-webinar',
		label: 'Events webinar',
	},
	{
		name: 'feedback-random-survey',
		label: 'Feedback random survey',
	},
	{
		name: 'welcome-to-an-event-platform',
		label: 'Welcome to an event platform',
	},
	{
		name: 'newsletters-flower-shop',
		label: 'Newsletters flower shop',
	},
	{
		name: 'newsletters-pizza',
		label: 'Newsletters pizza',
	},
	{
		name: 'transactional-payment-confirmation',
		label: 'Transactional payment confirmation',
	},
	{
		name: 'announcement-new-shop',
		label: 'Announcement new shop',
	},
	{
		name: 'announcements-new-app',
		label: 'Announcement new app',
	},
	{
		name: 'newsletter-city-breaks',
		label: 'Newsletter - city breaks',
	},
	{
		name: 'welcome-to-our-blog',
		label: 'Welcome to our blog',
	},
	{
		name: 'holiday-xmas',
		label: 'Holiday xmas',
	},
	{
		name: 'feedback-delivery-status',
		label: 'Feedback delivery status',
	},
	{
		name: 'holidays-kids-day',
		label: 'Holidays kids day',
	},
	{
		name: 'announcement-new-terms-and-conditions',
		label: 'Announcement new terms and conditions',
	},
	{
		name: 'deals-summer-deals',
		label: 'Deals summer deals',
	},
	{
		name: 'events-black-friday',
		label: 'Events black friday',
	},
	{
		name: 'feedback-order-survey',
		label: 'Feedback order survey',
	},
	{
		name: 'deals-autumn-deals',
		label: 'Deals autumn deals',
	},
	{
		name: 'featured-new-product',
		label: 'Featured new product',
	},
	{
		name: 'newsletters-seaside-booking',
		label: 'Newsletters seaside booking',
	},
	{
		name: 'feedback-website-experience',
		label: 'Feedback website experience',
	},
	{
		name: 'holidays-valentine',
		label: 'Holidays valentine',
	},
	{
		name: 'transactional-pass-change',
		label: 'Transactional pass change',
	},
	{
		name: 'events-giveaway',
		label: 'Events giveaway',
	},
	{
		name: 're-engagement-product-in-basket',
		label: 'Re engagement product in basket',
	},
	{
		name: 'featured-product-price-alert',
		label: 'Featured product price alert',
	},
	{
		name: "holidays-mother's-day",
		label: "Holidays mother's day",
	},
	{
		name: 'holidays-new-year',
		label: 'Holidays new year',
	},
	{
		name: 'announcement-important-info',
		label: 'Announcement important info',
	},
	{
		name: 'events-halloween-party',
		label: 'Events halloween party',
	},
	{
		name: 'deals-spring',
		label: 'Deals spring',
	},
	{
		name: 'feedback-log-in',
		label: 'Feedback log in',
	},
	{
		name: 'announcements-working-hours',
		label: 'Announcements working hours',
	},
	{
		name: 'announcements-new-website',
		label: 'Announcements - new website',
	},
	{
		name: 'deals-winter-sale',
		label: 'Deals winter sale',
	},
	{
		name: 'events-early-booking',
		label: 'Events early booking',
	},
	{
		name: 'feedback-fidelity-points',
		label: 'Feedback fidelity points',
	},
	{
		name: 'welcome-to-our-community',
		label: 'Welcome to our community',
	},
	{
		name: 'welcome-activation-key',
		label: 'Welcome activation key',
	},
	{
		name: 'announcements-xmas-store-working-hours',
		label: 'Announcements xmas store working hours',
	},
	{
		name: 'newsletters-donate',
		label: 'Newsletters donate',
	},
	{
		name: 'newsletters-general-blog',
		label: 'Newsletters general blog',
	},
	{
		name: 'newsletters-craft-beer',
		label: 'Newsletters craft beer',
	},
	{
		name: 'newsletters-books',
		label: 'Newsletters books',
	},
	{
		name: 'feedback-product-feedback',
		label: 'Feedback product feedback',
	},
	{
		name: 'newsletters-fashion',
		label: 'Newsletters fashion',
	},
	{
		name: 'newsletters-online-courses',
		label: 'Newsletters online courses',
	},
	{
		name: 'transactional-certificate-download',
		label: 'Transactional certificate download',
	},
	{
		name: 'newsletters-4th-july',
		label: 'Newsletters 4th july',
	},
	{
		name: 'events-concert',
		label: 'Events concert',
	},
	{
		name: 'newsletters-corporate',
		label: 'Newsletters corporate',
	},
	{
		name: 'featured-shoes',
		label: 'Featured shoes',
	},
	{
		name: 'newsletters-design-inspiration',
		label: 'Newsletters design inspiration',
	},
	{
		name: 'newsletters-fashion-blogger',
		label: 'Newsletters fashion blogger',
	},
	{
		name: 'deals-weekend-deals',
		label: 'Deals weekend deals',
	},
	{
		name: 'featured-random-discount',
		label: 'Featured random discount',
	},
	{
		name: 'holidays-easter',
		label: 'Holidays easter',
	},
	{
		name: 'transactional-order-confirmation',
		label: 'Transactional order confirmation',
	},
	{
		name: 'transactional-voucher',
		label: 'Transactional voucher',
	},
	{
		name: 'transactional-booking-confirmation',
		label: 'Transactional booking confirmation',
	},
	{
		name: 'holidays-hanukkah',
		label: 'Holidays hanukkah',
	},
	{
		name: 'holiday-chinese-new-year',
		label: 'Holiday chinese new year',
	},
	{
		name: 'transactional-first-order',
		label: 'Transactional first order',
	},
	{
		name: 'holiday-thanksgiving-day',
		label: 'Holiday thanksgiving day',
	},
	{
		name: 're-engagement-interested-products',
		label: 'Re engagement interested products',
	},
	{
		name: 're-engament-we-missed-you',
		label: 'Re engament we missed you',
	},
	{
		name: 'newsletters-wedding-cakes',
		label: 'Newsletters wedding cakes',
	},
	{
		name: 'newsletters-business-blog',
		label: 'Newsletters business blog',
	},
	{
		name: 'newsletters-local-farmer-online',
		label: 'Newsletters local farmer online',
	},
	{
		name: 'featured-xmas-decoration',
		label: 'Featured xmas decoration',
	},
	{
		name: 'welcome-new-subscription',
		label: 'Welcome new subscription',
	},
	{
		name: 'events-online-contest',
		label: 'Events online contest',
	},
	{
		name: 'feedback-simple-survey',
		label: 'Feedback simple survey',
	},
	{
		name: 'welcome-online-yoga',
		label: 'Welcome online yoga',
	},
	{
		name: 'newsletters-home-design',
		label: 'Newsletters home design',
	},
	{
		name: 'newsletters-stakehouse',
		label: 'Newsletters stakehouse',
	},
	{
		name: 'transactional-simple-payment-confirmation',
		label: 'Transactional simple payment confirmation',
	},
	{
		name: 'announcement-furniture-shop',
		label: 'Announcement furniture shop',
	},
	{
		name: 'announcements-new-fitness-app',
		label: 'Announcement - new fitness app',
	},
	{
		name: 'newsletter-travel-the-world',
		label: 'Newsletter - travel the world',
	},
	{
		name: 'welcome-simple-blog',
		label: 'Welcome simple blog',
	},
	{
		name: 'holiday-easter-2',
		label: 'Holiday easter 2',
	},
	{
		name: 'feedback-delivery-update',
		label: 'Feedback delivery update',
	},
	{
		name: "holidays-men's-day",
		label: "Holidays men's day",
	},
	{
		name: 'announcement-new-travel-regulations',
		label: 'Announcement new travel regulations',
	},
	{
		name: 'deals-summer-sale',
		label: 'Deals summer sale',
	},
	{
		name: 'events-black-friday-sales',
		label: 'Events black friday sales',
	},
	{
		name: 'feedback-survey-email',
		label: 'Feedback survey email',
	},
	{
		name: 'deals-spa-sales',
		label: 'Deals spa sales',
	},
	{
		name: 'announcements-new-gadget',
		label: 'Announcements new gadget',
	},
	{
		name: 'newsletters-glamping',
		label: 'Newsletters glamping',
	},
	{
		name: 'feedback-game-experience',
		label: 'Feedback game experience',
	},
	{
		name: 'holidays-happy-birthday',
		label: 'Holidays happy birthday',
	},
	{
		name: 'transactional-confirm-email-address',
		label: 'Transactional confirm email address',
	},
	{
		name: 'events-conference-invitation',
		label: 'Events conference invitation',
	},
	{
		name: 're-engagement-product-sold',
		label: 'Re engagement product sold',
	},
	{
		name: 're-engagement-product-price-alert-2',
		label: 'Re engagement product price alert 2',
	},
	{
		name: 'holidays-independence-day',
		label: 'Holidays independence day',
	},
	{
		name: 'deals-hot-sale',
		label: 'Deals hot sale',
	},
	{
		name: 'announcement-informational',
		label: 'Announcement informational',
	},
	{
		name: 'events-club-party',
		label: 'Events club party',
	},
	{
		name: 'deals-manicure-products',
		label: 'Deals manicure products',
	},
	{
		name: 'feedback-recover-password',
		label: 'Feedback recover password',
	},
	{
		name: 'announcements-new-branding',
		label: 'Announcements - new branding',
	},
	{
		name: 'deals-school-supplies',
		label: 'Deals school supplies',
	},
	{
		name: 'deals-real-estate',
		label: 'Deals real estate',
	},
	{
		name: 'newsletters-nature-blog',
		label: 'Newsletters nature blog',
	},
	{
		name: 'welcome-thank-you-for-subscribing',
		label: 'Welcome thank you for subscribing',
	},
	{
		name: 'announcements-easter-working-hours',
		label: 'Announcements easter working hours',
	},
	{
		name: 'newsletters-crypto-news',
		label: 'Newsletters crypto news',
	},
	{
		name: 'newsletters-music-blog',
		label: 'Newsletters music blog',
	},
	{
		name: 'newsletters-maxi-dresses',
		label: 'Newsletters maxi dresses',
	},
	{
		name: 'newsletters-multipurpose-products',
		label: 'Newsletters multipurpose products',
	},
	{
		name: 'newsletters-earth-day',
		label: 'Newsletters earth day',
	},
	{
		name: 'transactional-download-invoice',
		label: 'Transactional download invoice',
	},
	{
		name: 'newsletters-vet-working-hours',
		label: 'Newsletters vet working hours',
	},
	{
		name: 'events-marathon',
		label: 'Events marathon',
	},
	{
		name: 'newsletters-tea-lover-blog',
		label: 'Newsletters tea lover blog',
	},
	{
		name: 'newsletters-recipes',
		label: 'Newsletters recipes',
	},
	{
		name: 'events-animal-shelter-faire',
		label: 'Events animal shelter faire',
	},
	{
		name: 'newsletters-nutrition-tips&tricks',
		label: 'Newsletters nutrition tips&tricks',
	},
	{
		name: 'newsletters-support-local-business',
		label: 'Newsletters support local business',
	},
	{
		name: 'transactional-order-status-change',
		label: 'Transactional order status change',
	},
	{
		name: 'transactional-gift-voucher-from-friends',
		label: 'Transactional gift voucher from friends',
	},
	{
		name: 'newsletters-new-clinic',
		label: 'Newsletters new clinic',
	},
	{
		name: 'holidays-christmas-wishes',
		label: 'Holidays christmas wishes',
	},
	{
		name: 'newsletters-new-car-model',
		label: 'Newsletters new car model',
	},
	{
		name: 'newsletters-horoscope',
		label: 'Newsletters horoscope',
	},
	{
		name: "holiday-international-women's-day",
		label: "Holiday international women's day",
	},
	{
		name: 'welcome-welcome-back',
		label: 'Welcome welcome back',
	},
	{
		name: 'newsletters-style-guide',
		label: 'Newsletters style guide',
	},
	{
		name: 'newsletters-auto-dealer',
		label: 'Newsletters auto dealer',
	},
	{
		name: 're-engagement-create-wishlist',
		label: 'Re engagement create wishlist',
	},
	{
		name: 'deals-annual-plans-discount',
		label: 'Deals annual plans discount',
	},
	{
		name: 're-engagement-quiz',
		label: 'Re engagement quiz',
	},
	{
		name: 'newsletters-dev-blog',
		label: 'Newsletters dev blog',
	},
	{
		name: 'transactional-verify-email',
		label: 'Transactional verify email',
	},
	{
		name: 'newsletters-toys-shop-online',
		label: 'Newsletters toys shop online',
	},
	{
		name: 'featured-board-games',
		label: 'Featured board games',
	},
	{
		name: 'welcome-cyber-security',
		label: 'Welcome cyber security',
	},
	{
		name: 'welcome-cancel-subscription',
		label: 'Welcome cancel subscription',
	},
	{
		name: 'transactional-payment-failed',
		label: 'Transactional payment failed',
	},
	{
		name: 'featured-best-city',
		label: 'Featured best city',
	},
	{
		name: 'transactional-delete-account',
		label: 'Transactional delete account',
	},
	{
		name: 'newsletters-new-year-news',
		label: 'Newsletters new year news',
	},
	{
		name: 'newsletters-recommended-brands',
		label: 'Newsletters recommended brands',
	},
	{
		name: 'transactional-visit-vet-reminder',
		label: 'Transactional visit vet reminder',
	},
	{
		name: 'deals-countdown-sale',
		label: 'Deals countdown sale',
	},
	{
		name: 'deals-holiday-sale',
		label: 'Deals holiday sale',
	},
	{
		name: 'announcement-multilingual',
		label: 'Announcement multilingual',
	},
	{
		name: 're-engagemenet-complete-your-profile',
		label: 'Re engagemenet complete your profile',
	},
	{
		name: 'newsletters-lgbtq-blog',
		label: 'Newsletters lgbtq blog',
	},
	{
		name: 'transactional-event-digital-ticket',
		label: 'Transactional event digital ticket',
	},
	{
		name: 'newsletters-celebrity-news-blog',
		label: 'Newsletters celebrity news blog',
	},
	{
		name: 'feedback-booking-feedback',
		label: 'Feedback booking feedback',
	},
	{
		name: 'transactional-requested-quote',
		label: 'Transactional requested quote',
	},
	{
		name: 'newsletters-design-trends',
		label: 'Newsletters design trends',
	},
	{
		name: 'newsletters-it-courses',
		label: 'Newsletters it courses',
	},
	{
		name: 'deals-monthly-discount',
		label: 'Deals monthly discount',
	},
	{
		name: 'announcement-scheduled-maintenance',
		label: 'Announcement scheduled maintenance',
	},
	{
		name: 'transactional-pick-up-your-order',
		label: 'Transactional pick up your order',
	},
	{
		name: 'transactional-reminder-to-check-email',
		label: 'Transactional reminder to check email',
	},
	{
		name: 'announcement-account-approved',
		label: 'Announcement account approved',
	},
	{
		name: 'featured-last-products-available',
		label: 'Featured last products available',
	},
	{
		name: 'welcome-online-personal-growth-coach',
		label: 'Welcome online personal growth coach',
	},
	{
		name: 'newsletters-university',
		label: 'Newsletters university',
	},
	{
		name: 'newsletters-fitness-blog',
		label: 'Newsletters fitness blog',
	},
	{
		name: 'announcement-something-new',
		label: 'Announcement something new',
	},
	{
		name: 'deals-order-food',
		label: 'Deals order food',
	},
	{
		name: 'newsletters-travel-agency',
		label: 'Newsletters travel agency',
	},
	{
		name: 'events-company-party',
		label: 'Events company party',
	},
	{
		name: 'transactional-utility-bill',
		label: 'Transactional utility bill',
	},
	{
		name: 'announcements-spring-cleaning',
		label: 'Announcements spring cleaning',
	},
	{
		name: 'newsletters-moving-company',
		label: 'Newsletters moving company',
	},
	{
		name: 'newsletters-accounting-&-legal',
		label: 'Newsletters accounting & legal',
	},
	{
		name: 'featured-baby-clothing-shop',
		label: 'Featured baby clothing shop',
	},
	{
		name: 'newsletters-3d-models',
		label: 'Newsletters 3d models',
	},
	{
		name: 'events-beach-party',
		label: 'Events beach party',
	},
	{
		name: 'newsletters-funeral-home',
		label: 'Newsletters funeral home',
	},
	{
		name: 'newsletters-drawing-tutorials',
		label: 'Newsletters drawing tutorials',
	},
	{
		name: 'transactional-1-year-customer',
		label: 'Transactional 1 year customer',
	},
	{
		name: 'transactional-expired-insurance',
		label: 'Transactional expired insurance',
	},
	{
		name: 'newsletters-shipping-company',
		label: 'Newsletters shipping company',
	},
	{
		name: 'deals-custom-t-shirts',
		label: 'Deals custom t shirts',
	},
	{
		name: 'featured-new-home',
		label: 'Featured new home',
	},
	{
		name: 'featured-best-sellers',
		label: 'Featured best sellers',
	},
	{
		name: 'transactional-medical-results',
		label: 'Transactional medical results',
	},
	{
		name: 'newsletters-cinema',
		label: 'Newsletters cinema',
	},
	{
		name: 'deals-your-birthday-rate',
		label: 'Deals your birthday rate',
	},
	{
		name: 'transactional-thank-you-voucher',
		label: 'Transactional thank you voucher',
	},
	{
		name: 'newsletters-online-newspaper',
		label: 'Newsletters online newspaper',
	},
	{
		name: 'events-cultural-events',
		label: 'Events cultural events',
	},
	{
		name: 'deals-diy-store',
		label: 'Deals diy store',
	},
	{
		name: 'welcome-thank-you-for-updating',
		label: 'Welcome thank you for updating',
	},
	{
		name: 'newsletters-burger-house',
		label: 'Newsletters burger house',
	},
];

export { patternsCategories };
