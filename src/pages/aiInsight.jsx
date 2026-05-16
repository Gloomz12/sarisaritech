import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import Header from "../component/aiinsight/Header";

import Tabs from "../component/aiinsight/Tabs";

import Overview from "../component/aiinsight/Overview";

import ForecastSection from "../component/aiinsight/ForecastSection";

import AprioriSection from "../component/aiinsight/AprioriSection";

import RestockSection from "../component/aiinsight/RestockSection";

import GeminiSection from "../component/aiinsight/GeminiSection";

export default function AiInsight() {
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("forecast");

  /* URL TAB SYNC */

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab) {
      setActiveTab(tab);

      setTimeout(() => {
        const section = document.getElementById(`${tab}-section`);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [searchParams]);

  /* MANUAL TAB SWITCH */

  const navigateInsight = (tab) => {
    setActiveTab(tab);

    setTimeout(() => {
      const section = document.getElementById(`${tab}-section`);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div
      className="
        min-h-screen

        bg-[#f5f7fb]
        dark:bg-[#0B1120]

        p-6
        space-y-6

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

      <Header />

      {/* OVERVIEW */}

      <Overview />

      {/* TABS */}

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* FORECAST */}

      <div id="forecast-section">{activeTab === "forecast" && <ForecastSection navigateInsight={navigateInsight} />}</div>

      {/* APRIORI */}

      <div id="apriori-section">{activeTab === "apriori" && <AprioriSection navigateInsight={navigateInsight} />}</div>

      {/* RESTOCK */}

      <div id="restock-section">{activeTab === "restock" && <RestockSection navigateInsight={navigateInsight} />}</div>

      {/* GEMINI */}

      <div id="gemini-section">{activeTab === "gemini" && <GeminiSection navigateInsight={navigateInsight} />}</div>
    </div>
  );
}
