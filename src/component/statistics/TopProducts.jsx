export default function TopProducts({ products }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Top Products</h2>

          <p className="text-sm text-gray-500">Best selling products</p>
        </div>
      </div>

      <div className="space-y-5">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-bold">{index + 1}</div>

              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>

                <p className="text-xs text-gray-400">{product.category}</p>
              </div>
            </div>

            <h3 className="font-bold text-orange-500">₱{product.sales}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
