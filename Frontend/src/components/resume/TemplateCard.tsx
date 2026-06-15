import { CheckCircle, Eye } from "lucide-react";
import { Badge, Button, Card } from "../common";

type TemplateCardProps = {
  title: string;
  description: string;
  image?: string;
  category?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
};

const TemplateCard = ({
  title,
  
  description,
  image,
  category = "ATS Friendly",
  isSelected = false,
  onSelect,
  onPreview,
}: TemplateCardProps) => {
  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative h-56 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-950">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-40 w-28 rounded-xl bg-white dark:bg-slate-950 p-4 shadow-lg border border-gray-100 dark:border-white/5">
              <div className="mb-3 h-3 w-20 rounded bg-gray-900 dark:bg-indigo-500" />
              <div className="space-y-2">
                <div className="h-2 rounded bg-gray-300 dark:bg-slate-800" />
                <div className="h-2 rounded bg-gray-300 dark:bg-slate-800" />
                <div className="h-2 w-16 rounded bg-gray-300 dark:bg-slate-800" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded bg-indigo-200 dark:bg-indigo-950" />
                <div className="h-2 rounded bg-indigo-200 dark:bg-indigo-950" />
              </div>
            </div>
          </div>
        )}

        {isSelected && (
          <div className="absolute right-3 top-3 rounded-full bg-green-500 p-2 text-white shadow-lg">
            <CheckCircle size={18} />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge>{category}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>

        <div className="mt-5 flex gap-3">
          <Button fullWidth onClick={onSelect}>
            {isSelected ? "Selected" : "Use Template"}
          </Button>

          <Button variant="outline" onClick={onPreview}>
            <Eye size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard;




