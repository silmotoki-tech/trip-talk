import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import {
  mkdirSync,
  rmSync,
  writeFileSync,
  unlinkSync,
  rmdirSync,
  existsSync,
  mkdtempSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
const route = "src/app/m1-test";
const screenshots = mkdtempSync(join(tmpdir(), "trip-talk-ui-"));
(async () => {
  if (existsSync(route))
    throw new Error("一時テスト用パスが既にあります。上書きしません。");
  mkdirSync(route);
  writeFileSync(
    `${route}/page.tsx`,
    `import TripTalk from "@/components/trip-talk";
import { parseScript } from "@/lib/script-schema";
import sample from "../../../tests/fixtures/sample.json";
export default function TestPage() { return <TripTalk scripts={[parseScript(sample)]} />; }`,
  );
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3011",
    ],
    {
      env: {
        ...process.env,
        GITHUB_ACTIONS: "false",
        NEXT_PUBLIC_FIREBASE_API_KEY: "",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
        NEXT_PUBLIC_FIREBASE_APP_ID: "",
      },
      stdio: "ignore",
    },
  );
  let browser;
  try {
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null)
        throw new Error("テストサーバーの起動に失敗しました");
      try {
        if ((await fetch("http://127.0.0.1:3011/")).ok) break;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    browser = await chromium.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    });
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:3011/");
    await page.getByText("台本はまだありません").waitFor();
    await page.screenshot({
      path: join(screenshots, "empty.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: /ちゃみ/ }).click();
    await page
      .getByText("ちゃみとして練習します。", { exact: false })
      .waitFor();
    await page.goto("http://127.0.0.1:3011/m1-test/");
    await page.getByRole("button", { name: "MOTOKI999999を開く" }).click();
    assert.equal(
      await page.getByRole("button", { name: "音読 +1" }).isDisabled(),
      true,
    );
    await page.getByRole("checkbox", { name: "日本語を表示" }).check();
    await page.getByText("質問1？", { exact: true }).waitFor();
    await page.screenshot({
      path: join(screenshots, "full.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: "質問だけで練習" }).click();
    assert.equal(
      await page.getByText("Answer one.", { exact: true }).count(),
      0,
    );
    await page.getByRole("button", { name: "答えを見る" }).click();
    await page.getByText("Answer one.", { exact: true }).waitFor();
    await page.getByRole("button", { name: "次へ", exact: true }).click();
    assert.equal(
      await page.getByText("Answer one.", { exact: true }).count(),
      0,
    );
    await page.getByRole("button", { name: "答えを見る" }).click();
    await page.getByText("直後の回答例はありません。").waitFor();
    await page.getByRole("button", { name: "次へ", exact: true }).click();
    await page.screenshot({
      path: join(screenshots, "questions.png"),
      fullPage: true,
    });
    await page.getByRole("button", { name: "次へ", exact: true }).click();
    await page.getByText("最後まで練習しました").waitFor();
    await page
      .getByRole("button", { name: "読み上げ指示書", exact: true })
      .click();
    assert.match(await page.getByRole("textbox").inputValue(), /もう一回/);
    await page.getByRole("button", { name: "指示書をコピー" }).click();
    await page.getByText("コピーしました", { exact: true }).waitFor();
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    }
    await page.getByRole("button", { name: /タモやん/ }).click();
    await page.getByRole("button", { name: "MOTOKI999999を開く" }).waitFor();
    assert.deepEqual(errors, []);
    console.log(
      "PASS: empty state, user switch, full text, Japanese toggle, question/answer/next/end, prompt/copy, disabled persistence, 320/390px overflow, no page errors",
    );
    console.log(`Screenshots: ${screenshots}`);
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    unlinkSync(`${route}/page.tsx`);
    rmdirSync(route);
    rmSync(".next/dev/types", { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
