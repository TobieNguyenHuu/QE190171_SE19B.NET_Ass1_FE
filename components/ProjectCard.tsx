import Link from "next/link";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { ProjectStatusBadge } from "./badges";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.projectId}`}
      className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug">{project.projectName}</h3>
        <ProjectStatusBadge value={project.status} />
      </div>
      <p className="mt-1 text-sm text-muted">{project.departmentName}</p>
      {project.description && <p className="mt-3 line-clamp-2 text-sm">{project.description}</p>}
      <p className="mt-auto pt-4 text-xs text-muted">
        {formatDate(project.startDate)} to {formatDate(project.endDate)} · {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
      </p>
    </Link>
  );
}
