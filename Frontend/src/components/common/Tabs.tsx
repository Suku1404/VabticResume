import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";

type TabItem = {
  label: string;
  value: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
};

const Tabs = ({ tabs, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const activeContent = tabs.find((tab) => tab.value === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="flex gap-2 rounded-2xl bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={clsx(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
              activeTab === tab.value
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5">{activeContent}</div>
    </div>
  );
};

export default Tabs;