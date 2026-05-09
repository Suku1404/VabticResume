import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type AccordionItem = {
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};

const Accordion = ({ items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-gray-900"
            >
              {item.title}
              <ChevronDown
                className={clsx(
                  "h-5 w-5 text-gray-500 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;