export default function CategoryDistribution({ categories }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Sales by Category</h2>

        <p className="text-sm text-gray-500">Distribution of sales by product category</p>
      </div>

      <div className="space-y-5">
        {categories.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>

              <span className="text-sm font-bold text-gray-900">{item.percent}%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{
                  width: `${item.percent}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
