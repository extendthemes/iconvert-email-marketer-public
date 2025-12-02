// @ts-nocheck
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import shortid from 'shortid';

const useIconvertemNotices = () => {
	const { createNotice, removeNotice } = useDispatch(noticesStore);

	/**
	 * createIconvertemNotice - Create new notice
	 *  *
	 *
	 * @param {string} content
	 * @param {Object} options
	 * @param {string} noticeType
	 */
	const createIconvertemNotice = (content, options, noticeType = 'default') => {
		const id = options ?? `iconvertem-notice-` + shortid.generate();
		const noticeOptions = [
			noticeType,
			content,
			{
				type: 'snackbar',
				...options,
				id,
			},
		];
		const result = createNotice(...noticeOptions);

		if (options?.duration) {
			setTimeout(() => {
				removeNotice(id);
			}, options?.duration);
		}

		return result;
	};

	/**
	 * createDefaultIconvertemNotice - Create new default notice
	 *  *
	 *
	 * @param {string} message
	 * @param {number} duration
	 */
	const createDefaultIconvertemNotice = (message, duration = 5000) => {
		return createIconvertemNotice(message, { duration }, 'default');
	};

	/**
	 * createInfoIconvertemNotice - Create new info notice
	 *  *
	 *
	 * @param {string} message
	 * @param {number} duration
	 */
	const createInfoIconvertemNotice = (message, duration = 5000) => {
		return createIconvertemNotice(message, { duration }, 'info');
	};

	/**
	 * createSuccessIconvertemNotice - Create new success notice
	 *  *
	 *
	 * @param {string} message
	 * @param {number} duration
	 */
	const createSuccessIconvertemNotice = (message, duration = 5000) => {
		return createIconvertemNotice(message, { duration }, 'success');
	};

	/**
	 * createErrorIconvertemNotice - Create new error notice
	 *  *
	 *
	 * @param {string} message
	 * @param {number} duration
	 */
	const createErrorIconvertemNotice = (message, duration = 5000) => {
		return createIconvertemNotice(message, { duration }, 'error');
	};

	/**
	 * createWarningIconvertemNotice - Create new warning notice
	 *  *
	 *
	 * @param {string} message
	 * @param {number} duration
	 */
	const createWarningIconvertemNotice = (message, duration = 5000) => {
		return createIconvertemNotice(message, { duration }, 'warning');
	};

	return {
		createIconvertemNotice,
		createDefaultIconvertemNotice,
		createInfoIconvertemNotice,
		createErrorIconvertemNotice,
		createSuccessIconvertemNotice,
		createWarningIconvertemNotice,
	};
};

export { useIconvertemNotices };
