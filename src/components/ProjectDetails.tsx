import { useRef, useState } from "react";
import { useSubscribe } from "../patterns/pubsub/useSubscribe";
import { messages } from "../patterns/pubsub/messages";

interface ProjectDetailsProps {}

export const ProjectDetails: React.FC<ProjectDetailsProps> = () => {
  const [projectSrc, setProjectSrc] = useState("");
  console.log(projectSrc);

  useSubscribe(messages.project.open, (src) => {
    setProjectSrc(src);
  });

  if (!projectSrc) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <img alt="project image" src={projectSrc} />
    </div>
  );
};
