// src/app/project/[projectId]/layout.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useEditorTabsStore } from "@/features/editor/model/use-panes-store";
export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { clearAllTabs } = useEditorTabsStore();
  const prevProjectIdRef = useRef<string | null>(null);

  // "Model is disposed!" 오류의 근본 원인을 해결하는 최종 로직
  useEffect(() => {
    const newProjectId = params?.projectId as string;

    // 이전 프로젝트 ID와 새로운 프로젝트 ID를 비교합니다.
    const prevId = prevProjectIdRef.current;

    // 이전 ID가 있고, 새로운 ID와 다를 때만 정리 함수를 호출합니다.
    // 이것이 경쟁 상태를 막는 가장 확실한 방법입니다.
    if (prevId && newProjectId && prevId !== newProjectId) {
      console.log(
        `Project changed from ${prevId} to ${newProjectId}. Cleaning up all resources.`
      );
      clearAllTabs();
    }

    // 현재 projectId를 ref에 업데이트합니다.
    prevProjectIdRef.current = newProjectId;
  }, [params?.projectId, clearAllTabs]);

  return <div style={{ height: "100vh" }}>{children}</div>;
}
