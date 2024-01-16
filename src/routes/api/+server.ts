import type { Config } from "@sveltejs/adapter-vercel";
export const config: Config = { runtime: "edge" };

export const GET = async () => {
  return new Response(`Hello world! - ${process.env.VERCEL_REGION}`);
};
