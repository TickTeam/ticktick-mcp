import { Task, TaskKind } from "../types.js";
import { formatToServerDate } from "../utils/date.js";
import { getUndoneTasksByCondition } from "./api.js";
import moment from "moment-timezone";

export const taskObject2Task = (object: Record<string, unknown>): Task => {
  return {
    id: object.id as Task["id"],
    title: object.title as Task["title"],
    content: object.content as Task["content"],
    desc: object.desc as Task["desc"],
    priority: object.priority as Task["priority"],
    projectId: object.projectId as Task["projectId"],
    items: object.items as Task["items"],
    kind: object.kind as Task["kind"],
    tags: (object.tags || []) as Task["tags"],
    startDate: object.startDate as Task["startDate"],
    dueDate: object.dueDate as Task["dueDate"],
    isAllDay: object.isAllDay as Task["isAllDay"],
    isFloating: object.isFloating as Task["isFloating"],
    timeZone: object.timeZone as Task["timeZone"],
  };
};

export const task2DisplayObject = (
  task: Task,
  id2ProjectName: Map<string, string>
) => {
  return {
    id: task.id,
    title: task.title,
    content: task.content,
    projectName: id2ProjectName.get(task.projectId) || "Inbox",
    priority: (() => {
      switch (task.priority) {
        case 5:
          return "P1";
        case 3:
          return "P2";
        case 1:
          return "P3";
        case 0:
        default:
          return "P4";
      }
    })(),
  };
};

export const fetchTodayUndoneTasks = async () => {
  const res = await getUndoneTasksByCondition({
    projectIds: [],
    taskIds: [],
    startDate: formatToServerDate(moment().startOf("day")) || "",
    endDate: formatToServerDate(moment().endOf("day")) || "",
  });
  if (res.status === 200 && Array.isArray(res.data)) {
    return res.data.map((datum) => taskObject2Task(datum));
  }
  return [];
};
