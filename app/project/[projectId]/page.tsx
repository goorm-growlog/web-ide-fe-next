"use client";

import { useParams } from "next/navigation";
import { ProjectEditorWidget } from "@/widgets/project-editor";

const ProjectPage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;

  if (!projectId) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return <ProjectEditorWidget projectId={projectId} />;
};

export default ProjectPage;
