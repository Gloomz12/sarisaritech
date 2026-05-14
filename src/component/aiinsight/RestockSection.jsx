import RestockTable from "./RestockTable";

export default function RestockSection() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Restock Recommendations</h2>

          <p className="text-sm text-gray-500">AI-powered inventory suggestions</p>
        </div>

        <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">Refresh</button>
      </div>

      <RestockTable />
    </div>
  );
}
