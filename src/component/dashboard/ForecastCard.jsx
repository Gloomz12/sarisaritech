export default function ForecastCard() {
  return (
    <div className="bg-white text-black rounded-2xl p-6">

      <h3 className="font-bold text-xl">
        Demand Forecast
      </h3>

      <p className="mt-4 text-green-500 text-3xl font-bold">
        +20%
      </p>

      <p className="mt-2 text-gray-500">
        Coke demand expected to rise.
      </p>

    </div>
  );
}