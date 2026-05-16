export default function Header() {
  return (
    <div
      className="
        flex
        items-center
        justify-between
      "
    >
      <div>
        <h1
          className="
            text-4xl
            font-black

            text-gray-900
            dark:text-white
          "
        >
          AI Insights
        </h1>

        <p
          className="
            mt-2

            text-sm

            text-gray-500
            dark:text-slate-400
          "
        >
          AI-powered analytics for smarter inventory decisions.
        </p>
      </div>
    </div>
  );
}
