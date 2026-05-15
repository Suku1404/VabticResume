import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SaveResume = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  // store all resumes
  const [resumes, setResumes] = useState([]);

  // function for fetching resumes
  const fetchResumes = async () => {

    try {

      // get token from localStorage
      const token = localStorage.getItem("token");

      // API call
      const response = await axios.get(
        `http://localhost:3000/api/auth/my-resume/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // save backend data into state
      setResumes(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  // run function when page loads
  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div>

      <h1>Loading...</h1>

      {
        resumes.map((resume: any) => (
          <div
            key={resume.id}
            onClick={() => navigate(`/my-resume/${resume.id}`)}
            className="cursor-pointer border p-4 rounded-lg"
          >

            <h2>{resume.title}</h2>

          </div>
        ))
      }

    </div>
  );
};

export default SaveResume;