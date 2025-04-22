#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addTask } from "./service/api.js";
import { fetchTodayUndoneTasks, task2DisplayObject } from "./service/task.js";
import { fetchProjects } from "./service/project.js";

// Create server instance
const server = new McpServer({
  name: "ticktick",
  version: "1.0.0",
});

server.tool(
  "get_todo_tasks",
  "Retrieve the today's to-do tasks from the TickTick." +
    "The task should be presented in a table format by default, displaying the title and project name, unless otherwise specified.",
  {},
  async () => {
    let error;
    try {
      const [tasks, projects] = await Promise.all([
        fetchTodayUndoneTasks(),
        fetchProjects(),
      ]);
      const id2ProjectName = projects.reduce(
        (res: Record<string, string>, project) => {
          res[project.id] = project.name;
          return res;
        },
        {}
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              tasks.map((task) => task2DisplayObject(task, id2ProjectName))
            ),
          },
        ],
      };
    } catch (e) {
      error = e;
    }
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error}`,
        },
      ],
    };
  }
);

server.tool(
  "add_task",
  "Add task to TickTick inbox",
  {
    title: z.string().nonempty(),
    content: z.string().optional(),
    date: z.string().describe("natural language due date").optional(),
    priority: z
      .enum(["P1", "P2", "P3", "P4"])
      .optional()
      .describe("Task priority"),
  },
  async ({ title, content, priority, date }) => {
    let error = null;
    try {
      const result = await addTask({
        title: title,
        dueString: date,
        description: content || "",
        priority: (() => {
          switch (priority) {
            case "P1":
              return "5";
            case "P2":
              return "3";
            case "P3":
              return "1";
            case "P4":
              return "0";
            default:
              break;
          }
        })(),
      });
      if (result) {
        return {
          content: [
            {
              type: "text",
              text: "Task added successfully",
            },
          ],
        };
      }
    } catch (e) {
      error = e;
    }
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error}`,
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TickTick MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
