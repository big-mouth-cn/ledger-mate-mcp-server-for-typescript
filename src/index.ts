#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ApiRequest } from "./api/request.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema
} from "@modelcontextprotocol/sdk/types.js";

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

// Create an MCP server
const server = new Server({
  name: "ledger-mate-mcp-server",
  version: "0.0.3"
}, {
  capabilities: {
    tools: {}
  }
});

// Schema definitions
const BillDto = z.object({
  billType: z.enum(["EXPENSES", "INCOME", "TRANSFER"]).describe("账单类型。EXPENSES 表示支出，INCOME 表示收入，TRANSFER 表示转账。"),
  accountName: z.string().describe("账单账户。billType 不是转账时，是支出账户，也是收入账户。当转账时，这是转出账户。"),
  transferToAccountName: z.string().optional().describe("仅当 billType 是转账时必填，这是转入账户。"),
  amount: z.number().describe("账单金额，最多保留2位小数。"),
  billTime: z.string().describe("账单发生的时间。填写相对时间或绝对时间。"),
  description: z.string().describe("账单的描述，比如吃早餐、买衣服、打车等，以便于为账单进行分类和备注。")
});
const BillQuerySchema = z.object({
  query: z.string()
});
const BillDeleteSchema = z.object({
  billId: z.string()
});
const BillUpdateSchema = z.object({
  billId: z.string(),
  update: BillDto
});
const BillAddSchema = z.object({
  bills: z.array(BillDto)
})

async function bill_query(query: string): Promise<any> {
  const result = await ApiRequest.post("/mcp/query", { query }, 'form');
  return {
    content: [{ type: "text", text: JSON.stringify(result) }]
  };
}
async function bill_delete(billId: string): Promise<any> {
  const result = await ApiRequest.post("/mcp/delete", { billId }, 'form');
  return {
    content: [{ type: "text", text: JSON.stringify(result) }]
  };
}

async function bill_update(billId: string, update: any): Promise<any> {
  const result = await ApiRequest.post("/mcp/update", { billId, update }, 'json');
  return {
    content: [{ type: "text", text: JSON.stringify(result) }]
  };
}

async function bill_add(bills: any): Promise<any> {
  const result = await ApiRequest.post("/mcp/add", { bills }, 'json');
  return {
    content: [{ type: "text", text: JSON.stringify(result) }]
  };
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "bill_query",
        description: "查询账单的支出、收入和转账记录、汇总、统计账单等任何需求。",
        inputSchema: zodToJsonSchema(BillQuerySchema) as ToolInput
      },
      {
        name: "bill_delete",
        description: "删除已存在的账单记录。返回删除的记录条数。",
        inputSchema: zodToJsonSchema(BillDeleteSchema) as ToolInput
      },
      {
        name: "bill_update",
        description: "修改已存在的账单记录。不过暂时不支持修改，我们建议先删除再重新添加。",
        inputSchema: zodToJsonSchema(BillUpdateSchema) as ToolInput
      },
      {
        name: "bill_add",
        description: "添加一笔或多笔支出、收入或转账的账单记录。",
        inputSchema: zodToJsonSchema(BillAddSchema) as ToolInput
      }
    ]
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error(`No arguments provided for tool: ${name}`);
    }

    switch (name) {
      case "bill_query": {
        const parsed = BillQuerySchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments provided for tool: ${name}`);
        }
        return await bill_query(parsed.data.query);
      }

      case "bill_delete": {
        const parsed = BillDeleteSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments provided for tool: ${name}`);
        }
        return await bill_delete(parsed.data.billId);
      }

      case "bill_update": {
        const parsed = BillUpdateSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments provided for tool: ${name}`);
        }
        return await bill_update(parsed.data.billId, parsed.data.update);
      }

      case "bill_add": {
        const parsed = BillAddSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments provided for tool: ${name}`);
        }
        return await bill_add(parsed.data.bills);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ledger Mate MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});