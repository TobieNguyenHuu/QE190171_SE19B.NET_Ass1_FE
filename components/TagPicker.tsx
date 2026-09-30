"use client";

import type { Tag } from "@/lib/types";

export function TagPicker({ tags, value, onChange }: { tags: Tag[]; value: number[]; onChange: (ids: number[]) => void }) {
  if (tags.length === 0) return <p className="text-sm text-muted">No tags yet. Create some in Manage → Tags.</p>;

  const toggle = (id: number) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Tags">
      {tags.map((tag) => {
        const on = value.includes(tag.tagId);
        const color = tag.color ?? "#64748B";
        return (
          <button
            key={tag.tagId}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(tag.tagId)}
            className="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
            style={on ? { color, backgroundColor: `${color}22`, borderColor: color } : { color: "#5B6673", borderColor: "#E2E6EB", backgroundColor: "#fff" }}
          >
            {on ? "✓ " : ""}{tag.tagName}
          </button>
        );
      })}
    </div>
  );
}
