import { danger, fail, markdown, message, schedule, warn } from "danger"
import { includes } from "lodash"

// TypeScript thinks we're in React Native,
// so the node API gives us errors:
import * as fs from "fs"
import * as path from "path"

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

const trivialPR = bodyAndTitle.includes("#trivial")

const typescriptOnly = (file: string) => includes(file, ".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

const modifiedAppFiles = modified.filter(p => filesOnly(p) && typescriptOnly(p))

// When there are app-changes and it's not a PR marked as trivial, expect
// there to be CHANGELOG changes.
const changelogChanges = includes(modified, "CHANGELOG.md")
if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
  fail("No CHANGELOG added.")
}

message("Changed Files in this PR: \n - " + modified.join("- "))
