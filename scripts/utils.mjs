import { execa } from 'execa';
import { readFileSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
const root = join(printDirname(), '..');

export async function publishPackages(updatedPkgs) {
  await Promise.all(
    updatedPkgs.map(({ location }) =>
      execa('yarn', ['publish', location, '--tag', '$npm_package_version']).then(
        ({ stdout }) => stdout,
      ),
    ),
  );
}

export async function buildPackages(updatedPkgs) {
  const projects = updatedPkgs.map((pkg) => pkg.name).join(',');
  const ps = execa('yarn', ['nx', 'run-many', '--projects', projects, '--target', 'build']);
  ps.stdout.pipe(process.stdout);
  return ps;
}

export async function pushToRemote(branch, remote = 'origin') {
  const { stdout } = await execa('git', [
    'push',
    '--follow-tags',
    '--no-verify',
    '--atomic',
    remote,
    branch,
  ]);

  console.log(stdout);
}
export async function tagPackages(updatedPackages) {
  const tags = updatedPackages.map((pkg) => `${pkg.name}@${pkg.version}`);
  const files = updatedPackages.map((pkg) => join(root, pkg.location, 'package.json'));

  const subject = `chore(release): publish\n\n`;
  const list = tags.map((tag) => `- ${tag}`).join('\n');
  const message = subject + list;

  // making a publish commit
  await execa('git', ['add', '--', ...files]);
  await execa('git', ['commit', '-m', message]);

  // creating annotated tags based on packages
  await Promise.all(tags.map((tag) => execa('git', ['tag', '-a', tag, '-m', tag])));
  console.log({ commit: message, tags });

  return tags;
}

export async function increaseVersionForNext(changedPkgs) {
  await Promise.all(
    changedPkgs.map(({ name }) =>
      execa('yarn', [
        'workspace',
        name,
        'version',
        '--preid=next',
        '--prerelease',
        '--no-git-tag-version',
      ]).then(({ stdout }) => stdout),
    ),
  );

  // Getting latest packages info to show the updated version.
  // We only return changed packges, not whole repo.
  const packages = (await workspacePackages()).filter((pkg) => {
    return !!changedPkgs.find((changedPkg) => pkg.name === changedPkg.name);
  });

  return packages;
}

export async function changed(since) {
  const pkgs = await workspacePackages();
  const all = await Promise.all(
    pkgs.map(({ name, location, version }) =>
      execa('git', ['log', `${since}..HEAD`, '--oneline', '--', location]).then(
        ({ stdout: result }) => {
          return {
            name,
            location,
            version,
            changed: !!result,
          };
        },
      ),
    ),
  );
  return all.filter((pkg) => pkg.changed);
}
export async function workspacePackages() {
  const { stdout } = await execa('yarn', ['workspaces', 'info']);
  const result = JSON.parse(stdout);
  const packagesName = Object.keys(result);
  const output = packagesName.map((name) => ({
    name,
    location: result[name].location,
    version: pacakgeJson(result[name].location).version,
  }));
  return output;
}

export function pacakgeJson(location) {
  const fullPath = join(root, location, 'package.json');
  const file = readFileSync(fullPath);
  return JSON.parse(file);
}

export function printDirname() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

function packageNameWithoutScope(name) {}
