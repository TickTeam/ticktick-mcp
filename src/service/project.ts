import { Project } from "../types.js";
import { getProjects } from "./api.js";

export const projectObject2Project = (
  object: Record<string, unknown>
): Project => {
  return {
    id: object.id as string,
    name: object.name as string,
  };
};

export const fetchProjects = async () => {
  const res = await getProjects();
  if (res.status === 200 && Array.isArray(res.data)) {
    return res.data.map((datum) => projectObject2Project(datum));
  }
  return [];
};
