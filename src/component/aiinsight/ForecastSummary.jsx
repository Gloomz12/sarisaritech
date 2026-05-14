export default function ForecastSummary() {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="font-bold text-gray-900">Forecast Summary</h3>

      <div className="mt-5">
        <p className="text-sm text-gray-500">Predicted Revenue</p>

        <h2 className="text-4xl font-bold text-gray-900 mt-2">₱12,450</h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Daily Average</span>

          <span className="font-semibold">₱1,779</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Best Day</span>

          <span className="font-semibold">Friday</span>
        </div>
      </div>
    </div>
  );
}
