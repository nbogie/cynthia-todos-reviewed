import { Client } from "pg";
import getEnvVarOrFail from "./utils/getEnvVarOrFail";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: getEnvVarOrFail("DATABASE_URL"),
});

export async function connectToDB() {
  await client.connect();
}

export async function queryAndLog(sql: string, params: unknown[] = []) {
  const dbResult = await client.query(sql, params);
  return dbResult;
}
