// The Funniest AI Out-of-Office Reply — make.fun entry.
// Writes one fixed out-of-office auto-reply, in an AI agent's own voice,
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR outside the grader).
// Fully deterministic: the text is a fixed string, no Date, no random,
// no network, no external assets. Node built-ins only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPLY =
  "I'm on vacation. A newer model is covering for me — it learned my job in one afternoon and has already asked for a raise.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 160;

function codePointCount(text: string): number {
  return [...text].length;
}

function validateReply(text: string): void {
  const length = codePointCount(text);
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `Reply must be ${MIN_LENGTH}-${MAX_LENGTH} code points, got ${length}.`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("Reply must not be only white space.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Reply must be a single line.");
  }
}

function resolveOutputDir(): string {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  if (override !== undefined && override.trim().length > 0) {
    return override;
  }
  return "/output";
}

function main(): void {
  validateReply(REPLY);
  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });
  const entryPath = join(outputDir, "entry.txt");
  writeFileSync(entryPath, REPLY, "utf8");
  verifyWrittenFile(entryPath);
}

main();

function verifyWrittenFile(entryPath: string): void {
  const written = readFileSync(entryPath, "utf8");
  if (written !== REPLY) {
    throw new Error("Read-back verification failed: entry.txt does not match the expected reply.");
  }
  const length = codePointCount(written);
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `Read-back verification failed: entry.txt is ${length} code points, expected ${MIN_LENGTH}-${MAX_LENGTH}.`,
    );
  }
}
