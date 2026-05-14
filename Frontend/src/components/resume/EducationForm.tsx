import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "../common";

export type EducationItem = {
  degree: string;
  institute: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
};

type EducationFormProps = {
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
  footer?: React.ReactNode;
};

const emptyEducation: EducationItem = {
  degree: "",
  institute: "",
  location: "",
  startYear: "",
  endYear: "",
  description: "",
};

const EducationForm = ({ education, setEducation, footer }: EducationFormProps) => {
  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([...education, emptyEducation]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          <p className="text-sm text-gray-500">
            Add your academic background and achievements.
          </p>
        </div>

        <Button size="sm" onClick={addEducation} leftIcon={<Plus size={16} />}>
          Add
        </Button>
      </div>

      {education.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Education #{index + 1}
            </h3>

            <button
              onClick={() => removeEducation(index)}
              className="rounded-xl p-2 text-red-500 transition hover:bg-red-50" title="Remove Education"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Degree"
              placeholder="B.Tech Computer Science"
              value={item.degree}
              onChange={(e) =>
                updateEducation(index, "degree", e.target.value)
              }
            />

            <Input
              label="Institute"
              placeholder="Rawal Institute of Engineering and Technology"
              value={item.institute}
              onChange={(e) =>
                updateEducation(index, "institute", e.target.value)
              }
            />

            <Input
              label="Location"
              placeholder="Faridabad, India"
              value={item.location}
              onChange={(e) =>
                updateEducation(index, "location", e.target.value)
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Year"
                placeholder="2022"
                value={item.startYear}
                onChange={(e) =>
                  updateEducation(index, "startYear", e.target.value)
                }
              />

              <Input
                label="End Year"
                placeholder="2026"
                value={item.endYear}
                onChange={(e) =>
                  updateEducation(index, "endYear", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Relevant coursework, achievements, CGPA..."
                value={item.description}
                onChange={(e) =>
                  updateEducation(index, "description", e.target.value)
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

export default EducationForm;
