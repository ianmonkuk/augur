import React, { Component, PropTypes } from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Basics from '../../market/components/basics';
import TradePanel from '../../../modules/trade/components/trade-panel';
import ReportPanel from '../../reports/components/report-panel';
import MarketPositions from '../../market/components/market-positions';
import MarketOpenOrders from '../../market/components/market-open-orders';
import Chart from '../../market/components/chart';

export default class MarketPage extends Component {
	static propTypes = {
		className: PropTypes.string,
		siteHeader: PropTypes.object,
		market: PropTypes.object,
		selectedOutcome: PropTypes.object,
		priceTimeSeries: PropTypes.array,
		numPendingReports: PropTypes.number,
		cancelOrder: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		const	nodes = [];

		// no market
		if (!p.market || !p.market.id) {
			nodes.push(
				<section key="no-market" className="basics">
					<span className="description">No market</span>
				</section>
			);
		} else {
			// market exists
			nodes.push(<Basics key="basics" {...p.market} />);

			// report form
			if (p.market.isPendingReport) {
				nodes.push(
					<ReportPanel
						key="report-panel"
						{...p.market}
						{...p.market.report}
						numPendingReports={p.numPendingReports}
					/>
				);
			}	else if (p.market.isOpen) {
				// trade panel
				nodes.push(
					<TradePanel
						key="trade-panel"
						outcomes={p.market.outcomes}
						selectedOutcome={p.selectedOutcome}
						tradeOrders={p.market.tradeSummary.tradeOrders}
						tradeSummary={p.market.tradeSummary}
						onSubmitPlaceTrade={p.market.onSubmitPlaceTrade}
					/>
				);

				// open orders
				if (p.market.userOpenOrdersSummary != null && p.market.userOpenOrdersSummary.openOrdersCount != null && p.market.userOpenOrdersSummary.openOrdersCount.value > 0) {
					nodes.push(
						<MarketOpenOrders
							key="market-open-orders"
							userOpenOrdersSummary={p.market.userOpenOrdersSummary}
							outcomes={p.market.outcomes}
							cancelOrder={p.cancelOrder}
						/>
					);
				}

				// positions
				if (p.market.positionsSummary && p.market.positionsSummary.numPositions && p.market.positionsSummary.numPositions.value) {
					nodes.push(
						<MarketPositions
							key="market-positions"
							className="market-positions"
							positionsSummary={p.market.positionsSummary}
							positionOutcomes={p.market.positionOutcomes}
						/>
					);
				}

				// chart
				nodes.push(
					<Chart
						key="chart"
						series={p.market.priceTimeSeries}
					/>
				);
			}
		}

		return (
			<main className="page market" onClick={() => p.selectedOutcome.updateSelectedOutcome(null)}>
				<SiteHeader {...p.siteHeader} />

				<article className="page-content">
					<div className="l-container">
						{nodes}
					</div>
				</article>

				<SiteFooter />
			</main>
		);
	}
}
