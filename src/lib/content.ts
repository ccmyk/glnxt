import { promises as fs } from "fs";
import path from "path";
import { zHome, zNav, type Home, type Nav } from "@/content/schema";

async function readJson<T>(relPath: string): Promise<T> {
  const abs = path.join(process.cwd(), relPath);
  const raw = await fs.readFile(abs, "utf-8");
  return JSON.parse(raw) as T;
}

export async function getHome(): Promise<Home> {
  const data = await readJson<any>("content/pages/home.json");
  return zHome.parse(data);
}

export async function getNav(): Promise<Nav> {
  const data = await readJson<any>("content/nav.json");
  return zNav.parse(data);
}
