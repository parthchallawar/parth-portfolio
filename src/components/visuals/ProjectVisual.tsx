import type { ProjectVisual as VisualId } from "@/content/projects";
import { AgentGraphVisual } from "./AgentGraphVisual";
import { CitationCheckVisual } from "./CitationCheckVisual";
import { LockRaceVisual } from "./LockRaceVisual";
import { TenantFlowVisual } from "./TenantFlowVisual";

export function ProjectVisual({ id, className }: { id: VisualId; className?: string }) {
  switch (id) {
    case "lock-race":
      return <LockRaceVisual className={className} />;
    case "agent-graph":
      return <AgentGraphVisual className={className} />;
    case "citation-check":
      return <CitationCheckVisual className={className} />;
    case "tenant-flow":
      return <TenantFlowVisual className={className} />;
  }
}
