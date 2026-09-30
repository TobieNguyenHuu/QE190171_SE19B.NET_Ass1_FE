export type Tone = "gray" | "blue" | "green" | "amber" | "red" | "sky";

export const TONE_CLASSES: Record<Tone, string> = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  sky: "bg-sky-50 text-sky-800 ring-sky-200",
};

export const TONE_DOT: Record<Tone, string> = {
  gray: "bg-slate-400",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  sky: "bg-sky-500",
};

export const PROJECT_STATUS = [
  { value: 0, label: "Not Started", tone: "gray" as Tone },
  { value: 1, label: "In Progress", tone: "blue" as Tone },
  { value: 2, label: "Completed", tone: "green" as Tone },
  { value: 3, label: "On Hold", tone: "amber" as Tone },
];

export const TASK_STATUS = [
  { value: 0, label: "To Do", tone: "gray" as Tone },
  { value: 1, label: "In Progress", tone: "blue" as Tone },
  { value: 2, label: "Done", tone: "green" as Tone },
  { value: 3, label: "Cancelled", tone: "red" as Tone },
];

export const TASK_PRIORITY = [
  { value: 0, label: "Low", tone: "gray" as Tone },
  { value: 1, label: "Medium", tone: "sky" as Tone },
  { value: 2, label: "High", tone: "amber" as Tone },
  { value: 3, label: "Critical", tone: "red" as Tone },
];
