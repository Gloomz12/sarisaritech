import { associationRules } from "./mockData";

export default function AssociationTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-4 text-sm text-gray-500">Products</th>

            <th className="pb-4 text-sm text-gray-500">Support</th>

            <th className="pb-4 text-sm text-gray-500">Confidence</th>

            <th className="pb-4 text-sm text-gray-500">Lift</th>
          </tr>
        </thead>

        <tbody>
          {associationRules.map((item, index) => (
            <tr key={index} className="border-b border-gray-50">
              <td className="py-4 font-medium">{item.products}</td>

              <td className="py-4">{item.support}</td>

              <td className="py-4">{item.confidence}</td>

              <td className="py-4">{item.lift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
