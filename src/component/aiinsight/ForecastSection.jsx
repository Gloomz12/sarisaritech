import ForecastChart from "./ForecastChart";
import ForecastSummary from "./ForecastSummary";

export default function ForecastSection() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Forecast Analytics</h2>

          <p className="text-sm text-gray-500">Sales forecasting using Prophet</p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm">7 Days</button>

          <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">30 Days</button>

          <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">90 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <ForecastChart />
        </div>

        <ForecastSummary />
      </div>
    </div>
  );
}
