import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiRotateCcw,
  FiClock,
  FiBarChart2,
  FiCpu,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar() {
  return (
    <div className="w-72 bg-white border-r min-h-screen p-5">

      <h1 className="text-3xl font-bold">
        <span className="text-orange-500">
          SariSari
        </span>
        Tech
      </h1>

      <div className="mt-10 space-y-3">

        <Menu icon={<FiHome />} text="Dashboard" active />

        <Menu icon={<FiShoppingCart />} text="Record Sale" />

        <Menu icon={<FiBox />} text="Inventory" />

        <Menu icon={<FiRotateCcw />} text="Restock" />

        <Menu icon={<FiClock />} text="History" />

        <Menu icon={<FiBarChart2 />} text="Statistics" />

        <Menu icon={<FiCpu />} text="AI Insight" />

        <Menu icon={<FiSettings />} text="Settings" />

        <Menu icon={<FiLogOut />} text="Logout" />

      </div>

    </div>
  );
}

function Menu({
  icon,
  text,
  active = false,
}) {
  return (
    <div
      className={`
        flex items-center gap-4
        p-4 rounded-xl cursor-pointer transition
        ${active
          ? "bg-orange-100 text-orange-600"
          : "hover:bg-gray-100"}
      `}
    >
      <div className="text-xl">
        {icon}
      </div>

      <span className="font-medium">
        {text}
      </span>
    </div>
  );
}