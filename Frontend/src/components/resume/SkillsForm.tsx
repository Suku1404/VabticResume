import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Input } from "../common";

type SkillsFormProps = {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
};

const SkillsForm = ({ skills, setSkills }: SkillsFormProps) => {
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    const value = skill.trim();

    if (!value) return;
    if (skills.includes(value)) return;

    setSkills([...skills, value]);
    setSkill("");
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((item) => item !== skillName));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Technical Skills</h2>
        <p className="text-sm text-gray-500">
          Add technologies, tools, frameworks, and programming languages.
        </p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="React.js, Node.js, Java..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addSkill();
          }}
        />

        <Button onClick={addSkill} leftIcon={<Plus size={17} />}>
          Add
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {skills.map((item) => (
          <Badge key={item} variant="primary" className="gap-2">
            {item}
            <button onClick={() => removeSkill(item)} title="Remove Skill">
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;