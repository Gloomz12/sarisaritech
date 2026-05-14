import Header from "../component/aiinsight/Header";
import Tabs from "../component/aiinsight/Tabs";

import Overview from "../component/aiinsight/Overview";

import ForecastSection from "../component/aiinsight/ForecastSection";
import AprioriSection from "../component/aiinsight/AprioriSection";
import RestockSection from "../component/aiinsight/RestockSection";

import GeminiSection from "../component/aiinsight/GeminiSection";

export default function AIInsight() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <Header />

      <Overview />

      <Tabs />

      <ForecastSection />

      <AprioriSection />

      <RestockSection />

      <GeminiSection />
    </div>
  );
}
