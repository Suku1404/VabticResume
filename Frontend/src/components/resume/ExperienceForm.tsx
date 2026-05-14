import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "../common";

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type ExperienceFormProps = {
  experience: ExperienceItem[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;
  footer?: React.ReactNode;
};

const emptyExperience: ExperienceItem = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const ExperienceForm = ({ experience, setExperience, footer }: ExperienceFormProps) => {
  const updateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addExperience = () => {
    setExperience([...experience, emptyExperience]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Experience</h2>
          <p className="text-sm text-gray-500">
            Add internships, jobs, freelance work, or training experience.
          </p>
        </div>

        <Button size="sm" onClick={addExperience} leftIcon={<Plus size={16} />}>
          Add
        </Button>
      </div>

      {experience.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Experience #{index + 1}
            </h3>

            <button
              onClick={() => removeExperience(index)}
              className="rounded-xl p-2 text-red-500 transition hover:bg-red-50"
              title="Remove Experience"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Role"
              placeholder="MERN Stack Developer Intern"
              value={item.role}
              onChange={(e) =>
                updateExperience(index, "role", e.target.value)
              }
            />

            <Input
              label="Company"
              placeholder="Khuban Software Development"
              value={item.company}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
            />

            <Input
              label="Location"
              placeholder="Remote / Noida"
              value={item.location}
              onChange={(e) =>
                updateExperience(index, "location", e.target.value)
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start"
                placeholder="Jan 2026"
                value={item.startDate}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
              />

              <Input
                label="End"
                placeholder="Present"
                value={item.endDate}
                onChange={(e) =>
                  updateExperience(index, "endDate", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Built responsive dashboards, integrated REST APIs, implemented JWT authentication..."
                value={item.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      {footer}
    </div>
  );
};

export default ExperienceForm;
