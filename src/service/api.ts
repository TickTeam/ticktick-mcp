import { openApiV1 } from "../utils/request.js";

export async function addTask(data: {
  projectId?: string;
  title: string;
  description: string;
  priority?: string;
}) {
  return await openApiV1.post("/task", data);
}

export async function getUndoneTasksByCondition(data: {
  projectIds: string[];
  taskIds: string[];
  startDate: string;
  endDate: string;
}) {
  return await openApiV1.post("/task/undone", data);
}

export async function getProjects() {
  return await openApiV1.get("/project");
}
