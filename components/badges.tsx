import { PROJECT_STATUS, TASK_PRIORITY, TASK_STATUS, TONE_CLASSES, TONE_DOT, type Tone } from "@/lib/constants";
import type { Tag } from "@/lib/types";

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

function pick(list: { value: number; label: string; tone: Tone }[], value: number) {
  return list.find((item) => item.value === value) ?? { value, label: "Unknown", tone: "gray" as Tone };
}

export function ProjectStatusBadge({ value }: { value: number }) {
  const s = pick(PROJECT_STATUS, value);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function TaskStatusBadge({ value }: { value: number }) {
  const s = pick(TASK_STATUS, value);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function PriorityBadge({ value }: { value: number }) {
  const s = pick(TASK_PRIORITY, value);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function TagChip({ tag }: { tag: Tag }) {
  const color = tag.color && /^#[0-9a-fA-F]{6}$/.test(tag.color) ? tag.color : "#64748B";
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: `${color}14`, borderColor: `${color}55` }}
    >
      {tag.tagName}
    </span>
  );
}

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return <span className="text-muted">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => <TagChip key={t.tagId} tag={t} />)}
    </div>
  );
}
