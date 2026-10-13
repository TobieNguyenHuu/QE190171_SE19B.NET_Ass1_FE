export type Tag = { tagId: number; tagName: string; color: string | null };
export type TagUsage = Tag & { taskCount: number };

export type Department = {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
  projectCount: number;
};
export type DepartmentDetail = Department & { projects: Project[] };

export type Project = {
  projectId: number;
  projectName: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: number;
  statusName: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  createdDate: string;
  taskCount: number;
};
export type ProjectDetail = Project & { tasks: Task[] };

export type Task = {
  taskId: number;
  title: string;
  description: string | null;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  dueDate: string | null;
  projectId: number;
  projectName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string | null;
  tags: Tag[];
};

export type DepartmentInput = { departmentName: string; departmentDescription: string; isActive: boolean };
export type ProjectInput = {
  projectName: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: number;
  departmentId: number;
  isActive: boolean;
};
export type TaskInput = {
  title: string;
  description: string | null;
  status: number;
  priority: number;
  dueDate: string | null;
  projectId: number;
  tagIds: number[];
};
export type TagInput = { tagName: string; color: string | null };

export type TaskFilters = { title?: string; status?: string; priority?: string; projectId?: string; tagId?: string };
export type ProjectFilters = { name?: string; status?: string; departmentId?: string };

export type Account = {
  accountId: number;
  fullName: string;
  email: string;
  /** 0 = Staff, 1 = Admin */
  role: number;
  roleName: string;
  createdDate: string;
};
export type LoginResponse = { token: string; expiresAt: string; account: Account };
export type LoginInput = { email: string; password: string };
export type RegisterInput = { fullName: string; email: string; password: string };
export type AccountInput = { fullName: string; role: number };
