import AssociationTable from "./AssociationTable";

export default function AprioriSection() {
  return (
    <section
      id="apriori-section"
      className="
      bg-white
      rounded-3xl
      border
      border-gray-100
      p-6
      shadow-sm
    "
    >
      <div
        className="
        flex
        items-center
        justify-between
        mb-2
      "
      >
        <div>
          <h2
            className="
            text-2xl
            font-bold
            text-gray-900
          "
          >
            Apriori Analysis
          </h2>

          <p
            className="
            text-sm
            text-gray-500
            mt-1
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
