import { createClient } from "@libsql/client";

export const client = createClient({
  url: import.meta.env.VITE_DB_URL,
  authToken: import.meta.env.VITE_DB_AUTH_TOKEN,
});
