import { useNavigate, useParams } from "react-router-dom";

import { ResumeForm } from "../components/resume";

const Builder = () => {

  const { templateId } = useParams();
  const navigate = useNavigate();

  return (
    <ResumeForm
      selectedTemplate={templateId || "ats"}
      onTemplateChange={(nextTemplateId) =>
        navigate(`/builder/${nextTemplateId}`)
      }
    />
  );
};

export default Builder;
















