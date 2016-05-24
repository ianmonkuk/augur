import { formatEther, formatPercent } from '../../../../utils/format-number';

import {
	TRADING_FEE_MIN, TRADING_FEE_MAX,
	INITIAL_LIQUIDITY_MIN, TRADING_FEE_DEFAULT,
	INITIAL_LIQUIDITY_DEFAULT
} from '../../../create-market/constants/market-values-constraints';

export const select = (formState) => {
	const obj = {
		tradingFeePercent: formState.tradingFeePercent || TRADING_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
	};
	return obj;
};

export const validateTradingFee = (tradingFeePercent) => {
	const parsed = parseFloat(tradingFeePercent);
	if (!tradingFeePercent) {
		return 'Please specify a trading fee %';
	}
	if (parsed !== tradingFeePercent) {
		return 'Trading fee must be a number';
	}
	if (parsed < TRADING_FEE_MIN || parsed > TRADING_FEE_MAX) {
		return `Trading fee must be between ${
		formatPercent(
			TRADING_FEE_MIN,
			true).full
		} and ${formatPercent(TRADING_FEE_MAX, true).full}`;
	}
};

export const validateMarketInvestment = (initialLiquidity) => {
	const parsed = parseFloat(initialLiquidity);
	if (!initialLiquidity) {
		return 'Please provide some initial liquidity';
	}
	if (parsed !== initialLiquidity) {
		return 'Initial liquidity must be numeric';
	}
	if (parsed < INITIAL_LIQUIDITY_MIN) {
		return `Initial liquidity must be at least ${
			formatEther(INITIAL_LIQUIDITY_MIN).full
		}`;
	}
};

export const isValid = (formState) => {
	if (validateTradingFee(formState.tradingFeePercent)) {
		return false;
	}

	if (validateMarketInvestment(formState.initialLiquidity)) {
		return false;
	}

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.tradingFeePercent !== undefined) {
		errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	}

	if (formState.initialLiquidity !== undefined) {
		errs.initialLiquidity =
		validateMarketInvestment(formState.initialLiquidity);
	}

	return errs;
};