#!/usr/bin/env node
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as tc from "@actions/tool-cache";
import * as semver from "semver";
import { createUnauthenticatedAuth } from "@octokit/auth-unauthenticated";

const token = core.getInput("javy-token");
const octokit = token
  ? github.getOctokit(token)
  : github.getOctokit(undefined!, {
      authStrategy: createUnauthenticatedAuth,
      auth: { reason: "no 'javy-token' input" },
    });

const versionRaw = core.getInput("javy-version");
let version: string;
if (versionRaw === "latest") {
  const { data } = await octokit.rest.repos.getLatestRelease({
    owner: "bytecodealliance",
    repo: "javy",
  });
  version = data.tag_name.slice(1);
} else {
  const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner: "bytecodealliance",
    repo: "javy",
  });
  const versions = releases.map((release) => release.tag_name.slice(1));
  version = semver.maxSatisfying(versions, versionRaw)!;
}
core.debug(`Resolved version: v${version}`);
if (!version) throw new DOMException(`${versionRaw} resolved to ${version}`);

let found = tc.find("javy", version);
core.setOutput("cache-hit", !!found);
if (!found) {
  const target = {
    "darwin,x64": "x86_64-macos",
    "darwin,arm64": "arm-macos",
    "linux,x64": "x86_64-linux",
    "linux,arm64": "arm-linux",
    "win32,x64": "x86_64-windows",
  }[[process.platform, process.arch].toString()]!;
  const archive = `javy-${target}-v${version}.gz`;

  found = await tc.downloadTool(
    `https://github.com/bytecodealliance/javy/releases/download/v${version}/${archive}`,
  );
  found = await tc.extractTar(found);
  found = await tc.cacheDir(found, "javy", version);
  core.info(`javy v${version} added to cache`);
}
core.addPath(found);
core.setOutput("javy-version", version);
core.info(`✅ javy v${version} installed!`);
