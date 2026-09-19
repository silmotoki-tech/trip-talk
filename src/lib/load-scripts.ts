import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseScript } from "./script-schema";

// Static export時に承認済みJSONだけを取り込む。fixtureはこのディレクトリへ置かない。
export function loadScripts() {
  const directory = join(process.cwd(), "data/scripts");
  return readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((name) => {
      const script = parseScript(
        JSON.parse(readFileSync(join(directory, name), "utf8")),
      );
      if (name !== `${script.id}.json`)
        throw new Error(`台本IDとファイル名が不一致: ${name}`);
      return script;
    });
}
