import AssociationTable from "./AssociationTable";

export default function AprioriSection() {
  return (
    <section
      id="apriori-section"
      className="
        rounded-3xl

        border
        border-gray-100
        dark:border-[#1F2937]

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-sm

        transition-all
        duration-300
      "
    >
      <div
        className="
          mb-2

          flex
          items-center
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold

              text-gray-900
              dark:text-white
            "
          >
            Apriori Analysis
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-gray-500
              dark:text-slate-400
            "
          >
            Frequently bought together products
          </p>
        </div>
      </div>

      <AssociationTable />
    </section>
  );
}
