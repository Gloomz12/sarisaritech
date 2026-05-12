import { FiShoppingCart, FiBarChart2, FiCpu, FiPackage } from "react-icons/fi";

export default function AuthLeftPanel({ register = false }) {
  return (
    <div
      className="
        hidden lg:flex
        lg:w-1/2
        relative
        overflow-hidden
        bg-cover
        bg-center
      "
      style={{
        backgroundImage: "url('/images/auth-bg.png')",
      }}
    >
      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/65" />

      {/* ORANGE GLOW */}

      <div
        className="
          absolute
          -top-32
          -left-32
          w-[420px]
          h-[420px]
          bg-orange-500/20
          blur-3xl
          rounded-full
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative z-10
          flex flex-col
          justify-between
          h-full
          w-full
          px-14
          py-12
          text-white
        "
      >
        {/* TOP */}

        <div>
          {/* LOGO */}

          <div className="flex items-center gap-4">
            <div
              className="
                w-16 h-16
                rounded-2xl
                bg-orange-500
                flex items-center justify-center
                text-3xl
                shadow-lg
                shadow-orange-500/40
              "
            >
              <FiShoppingCart />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                <span className="text-orange-500">SariSari</span>
                Tech
              </h1>

              <p className="text-gray-300 mt-1">AI-Powered Store Analytics</p>
            </div>
          </div>

          {/* HERO */}

          <div className="mt-20 max-w-xl">
            {register ? (
              <>
                <h2
                  className="
                    text-5xl
                    font-bold
                    leading-tight
                  "
                >
                  Create your
                  <br />
                  store account
                </h2>

                <p
                  className="
                    mt-6
                    text-lg
                    text-gray-300
                    leading-8
                    max-w-lg
                  "
                >
                  Manage inventory, monitor sales, and unlock AI-powered insights for your Sari-Sari
                  Store.
                </p>
              </>
            ) : (
              <>
                <h2
                  className="
                    text-5xl
                    font-bold
                    leading-tight
                  "
                >
                  Smart Analytics
                  <br />
                  for Sari-Sari Stores
                </h2>

                <p
                  className="
                    mt-6
                    text-lg
                    text-gray-300
                    leading-8
                    max-w-lg
                  "
                >
                  Analyze sales, forecast demand, detect buying patterns, and grow your store with
                  AI-powered insights.
                </p>
              </>
            )}
          </div>
        </div>

        {/* FEATURES */}

        <div className="space-y-7">
          <Feature
            icon={<FiBarChart2 />}
            title="Sales Analytics"
            text="Track store performance and sales trends in real-time."
          />

          <Feature
            icon={<FiCpu />}
            title="AI Insights"
            text="Get intelligent recommendations powered by AI."
          />

          <Feature
            icon={<FiPackage />}
            title="Inventory Intelligence"
            text="Monitor stocks and receive low-stock alerts instantly."
          />
        </div>
      </div>
    </div>
  );
}

/* FEATURE */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          w-14 h-14
          rounded-2xl
          bg-white/10
          border border-white/10
          backdrop-blur-md
          flex items-center justify-center
          text-2xl
          text-orange-400
          shrink-0
        "
      >
        {icon}
      </div>

      <div>
        <h3 className="text-xl font-semibold">{title}</h3>

        <p
          className="
            text-gray-300
            mt-1
            leading-7
            max-w-md
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}
