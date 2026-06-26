import { useNavigate, useParams } from "react-router-dom";

import { ResumeForm } from "../components/resume";

const Builder = () => {
  const { templateId, resumeId } = useParams();
  const navigate = useNavigate();

  return (
    <ResumeForm
      selectedTemplate={templateId || "ats"}
      resumeId={resumeId}
      onTemplateChange={(nextTemplateId) =>
        navigate(
          resumeId
            ? `/builder/${nextTemplateId}/${resumeId}`
            : `/builder/${nextTemplateId}`
        )
      }
    />
  );
};

export default Builder;
















