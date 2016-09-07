import { augur } from '../../../services/augurjs';

import {
PASSWORDS_DO_NOT_MATCH,
} from '../../auth/constants/form-errors';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';

export function register(name, password, password2, loginID, rememberMe, loginAccount, cb) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;

		if (loginID && links && links.marketsLink && !cb && loginAccount.keystore)	{
			if (rememberMe && localStorageRef && localStorageRef.setItem) {
				const persistentAccount = Object.assign({}, loginAccount);
				if (Buffer.isBuffer(persistentAccount.privateKey)) {
					persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
				}
				if (Buffer.isBuffer(persistentAccount.derivedKey)) {
					persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
				}
				localStorageRef.setItem('account', JSON.stringify(persistentAccount));
			}

			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());

			return links.marketsLink.onClick(links.marketsLink.href);
		}
		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}

		augur.web.register(name, password, (account) => {
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to register' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const localLoginAccount = { ...account, id: account.address, loginID: account.loginID || account.secureLoginID };
			if (!localLoginAccount || !localLoginAccount.id) {
				return;
			}

			dispatch(addFundNewAccount(localLoginAccount.address));
			dispatch(updateLoginAccount({ loginID: localLoginAccount.loginID }));

			if (typeof cb === 'function') {
				cb(localLoginAccount);
			}
		});
	};
}
