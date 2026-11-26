// The Self-Checkout Is Judging You — a make.fun entry.
//
// One funny line in the voice of a smug self-checkout machine, aimed at a
// shopper whose entire basket is twelve yoghurts and nothing else.
// The program writes exactly that line to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

const LINE =
  "Twelve yoghurts, no spoon, no shame \u2014 I've scanned your whole personality and it's somehow still full price.";

const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(message);
}

const chars = [...LINE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE !== LINE.trim()) {
  fail("entry must not start or end with whitespace");
}
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20) {
    fail("entry must not contain control characters");
  }
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = `${outDir}/entry.txt`;
writeFileSync(target, LINE, "utf8");
const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== LINE) {
  fail("written entry does not match the line exactly");
}
const bytes = Buffer.byteLength(LINE, "utf8");
const raw = readFileSync(target);
if (raw.length !== bytes || raw[raw.length - 1] === 0x0a) {
  fail("written entry must have no trailing newline");
}
console.log(`wrote ${chars} characters (${bytes} bytes) to ${target}`);
