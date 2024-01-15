import { createClient } from "@libsql/client";
import { DB_URL } from "$env/static/private";

export const client = createClient({
  url: DB_URL,
});
