import Link from "next/link";
import type { ReactNode } from "react";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { PriorityBadge, TagList, TaskStatusBadge } from "./badges";

export function TaskTable({
  tasks, showProject = true, actions,
}: { tasks: Task[]; showProject?: boolean; actions?: (task: Task) => ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-paper text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Task</th>
            {showProject && <th className="px-4 py-3 font-medium">Project</th>}
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Tags</th>
            <th className="px-4 py-3 font-medium">Due</th>
            {actions && <th className="px-4 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tasks.map((task) => (
            <tr key={task.taskId} className="align-top">
              <td className="min-w-[14rem] px-4 py-3">
                <Link href={`/tasks/${task.taskId}`} className="font-medium hover:text-accent hover:underline">{task.title}</Link>
              </td>
              {showProject && (
                <td className="px-4 py-3">
                  <Link href={`/projects/${task.projectId}`} className="text-muted hover:text-accent hover:underline">{task.projectName}</Link>
                </td>
              )}
              <td className="px-4 py-3"><TaskStatusBadge value={task.status} /></td>
              <td className="px-4 py-3"><PriorityBadge value={task.priority} /></td>
              <td className="min-w-[10rem] px-4 py-3"><TagList tags={task.tags} /></td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(task.dueDate)}</td>
              {actions && <td className="whitespace-nowrap px-4 py-3 text-right">{actions(task)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
