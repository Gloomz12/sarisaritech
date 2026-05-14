import { restockRecommendations } from "./mockData";

export default function RestockTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-4 text-sm text-gray-500">Product</th>

            <th className="pb-4 text-sm text-gray-500">Stock</th>

            <th className="pb-4 text-sm text-gray-500">Demand</th>

            <th className="pb-4 text-sm text-gray-500">Suggested</th>

            <th className="pb-4 text-sm text-gray-500">Priority</th>
          </tr>
        </thead>

        <tbody>
          {restockRecommendations.map((item, index) => (
            <tr key={index} className="border-b border-gray-50">
              <td className="py-4 font-medium">{item.product}</td>

              <td className="py-4">{item.stock}</td>

              <td className="py-4">{item.demand}</td>

              <td className="py-4 text-green-600 font-semibold">{item.suggested}</td>

              <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs">{item.priority}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
