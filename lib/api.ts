import { clearSession, getToken } from "./session";
import type {
  Account, AccountInput, LoginInput, LoginResponse, RegisterInput,
  Department, DepartmentDetail, DepartmentInput, Project, ProjectDetail, ProjectFilters, ProjectInput,
  Tag, TagInput, TagUsage, Task, TaskFilters, TaskInput,
} from "./types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");

/** Error thrown for every failed API call. `fieldErrors` maps form field names to messages (HTTP 400 validation). */
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

type ProblemBody = { title?: string; detail?: string; errors?: Record<string, string[]> };

function toFieldErrors(errors: Record<string, string[]> | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!errors) return result;
  for (const [key, messages] of Object.entries(errors)) {
    const name = key.replace(/^\$\./, "");
    const field = name.charAt(0).toLowerCase() + name.slice(1);
    if (messages?.length) result[field] = messages[0];
  }
  return result;
}

/** `auth: true` sends `Authorization: Bearer <token>`; an expired/invalid token (HTTP 401) sends the user to /login. */
async function request<T>(path: string, init: RequestInit & { json?: unknown; auth?: boolean } = {}): Promise<T> {
  const { json, auth, ...rest } = init;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (json !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...rest,
      headers,
      body: json !== undefined ? JSON.stringify(json) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Cannot reach the server. If it was idle, give it up to a minute to wake up, then retry.", 0);
  }

  if (response.status === 401 && auth) {
    clearSession();
    if (typeof window !== "undefined") window.location.assign("/login?expired=1");
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }
  if (response.status === 403) {
    throw new ApiError("You do not have permission to do this.", 403);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const problem = (body ?? {}) as ProblemBody;
    const fieldErrors = toFieldErrors(problem.errors);
    const firstField = Object.values(fieldErrors)[0];
    const message = problem.detail && !problem.errors ? problem.detail : firstField ?? problem.detail ?? problem.title ?? `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, fieldErrors);
  }
  return body as T;
}

function qs(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const api = {
  departments: {
    list: () => request<Department[]>("/api/departments"),
    get: (id: number | string) => request<DepartmentDetail>(`/api/departments/${id}`),
    create: (input: DepartmentInput) => request<Department>("/api/departments", { method: "POST", json: input, auth: true }),
    update: (id: number, input: DepartmentInput) => request<Department>(`/api/departments/${id}`, { method: "PUT", json: input, auth: true }),
    remove: (id: number) => request<void>(`/api/departments/${id}`, { method: "DELETE", auth: true }),
  },
  projects: {
    list: () => request<Project[]>("/api/projects"),
    get: (id: number | string) => request<ProjectDetail>(`/api/projects/${id}`),
    search: (filters: ProjectFilters) => request<Project[]>(`/api/projects/search${qs({ ...filters })}`),
    create: (input: ProjectInput) => request<Project>("/api/projects", { method: "POST", json: input, auth: true }),
    update: (id: number, input: ProjectInput) => request<Project>(`/api/projects/${id}`, { method: "PUT", json: input, auth: true }),
    remove: (id: number) => request<void>(`/api/projects/${id}`, { method: "DELETE", auth: true }),
  },
  tasks: {
    list: () => request<Task[]>("/api/tasks"),
    get: (id: number | string) => request<Task>(`/api/tasks/${id}`),
    search: (filters: TaskFilters) => request<Task[]>(`/api/tasks/search${qs({ ...filters })}`),
    create: (input: TaskInput) => request<Task>("/api/tasks", { method: "POST", json: input, auth: true }),
    update: (id: number, input: TaskInput) => request<Task>(`/api/tasks/${id}`, { method: "PUT", json: input, auth: true }),
    remove: (id: number) => request<void>(`/api/tasks/${id}`, { method: "DELETE", auth: true }),
  },
  auth: {
    register: (input: RegisterInput) => request<Account>("/api/auth/register", { method: "POST", json: input }),
    login: (input: LoginInput) => request<LoginResponse>("/api/auth/login", { method: "POST", json: input }),
  },
  accounts: {
    list: () => request<Account[]>("/api/accounts", { auth: true }),
    update: (id: number, input: AccountInput) => request<Account>(`/api/accounts/${id}`, { method: "PUT", json: input, auth: true }),
    remove: (id: number) => request<void>(`/api/accounts/${id}`, { method: "DELETE", auth: true }),
  },
  tags: {
    list: () => request<TagUsage[]>("/api/tags"),
    create: (input: TagInput) => request<TagUsage>("/api/tags", { method: "POST", json: input, auth: true }),
    update: (id: number, input: TagInput) => request<TagUsage>(`/api/tags/${id}`, { method: "PUT", json: input, auth: true }),
    remove: (id: number) => request<void>(`/api/tags/${id}`, { method: "DELETE", auth: true }),
  },
};

export type { Tag };
