// RestockLayout.jsx

export default function RestockLayout({ children }) {
  return (
    <div
      className="
        min-h-screen

        bg-[#F5F7FB]
        dark:bg-[#111827]

        pt-2
        pb-4

        transition-all
        duration-300
      "
    >
      {children}
    </div>
  );
}
