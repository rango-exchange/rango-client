import { execa } from 'execa';
import { join } from 'path';
import { NxError } from './errors.mjs';
import { getChangedPackagesFor } from './git.mjs';
import { detectChannel } from './github.mjs';
import { importJson, nxToGraph } from './graph/helpers.mjs';
import { Graph } from './graph/index.mjs';
import { packageNamesToPackagesWithInfo, printDirname } from './utils.mjs';

const root = join(printDirname(), '..', '..');

/**
 *
 * When a packages has been updated (source code), we will check what packages is dependent on that.
 *
 * @param {Array<import("./typedefs.mjs").Package>} changedPkgs
 * @returns
 */
export async function analyzeChangesEffects(changedPkgs) {
  const nxGraph = await exportNx();
  const graph = new Graph();
  const { nodesCount, edgesCount } = nxToGraph(nxGraph, graph);
  graph.onlyAffected(changedPkgs.map((pkg) => pkg.name));
  const sortedList = graph.sort();
  const sortedPackagesToPublish = await packageNamesToPackagesWithInfo([
    ...sortedList,
  ]);

  console.table([
    {
      name: 'Affected pacakges',
      value: sortedPackagesToPublish.length,
    },
    {
      name: 'Nodes',
      value: nodesCount,
    },
    {
      name: 'edges',
      value: edgesCount,
    },
    {
      name: 'Are we good?',
      // Note: these two numbers should be equal.
      value: nodesCount === edgesCount ? 'yes' : 'no',
    },
  ]);

  console.log(
    'Ordering:',
    sortedPackagesToPublish.map((pkg) => pkg.name).join(',')
  );
  return sortedPackagesToPublish;
}

export async function exportNx() {
  const filename = '__output__.json';
  const filepath = join(root, filename);
  await execa('yarn', ['nx', 'graph', '--file', filename]).catch((error) => {
    throw new NxError(`Creating graph file failed. \n ${error.stderr}`);
  });
  const nxGraph = await importJson(filepath);
  await execa('rm', ['-f', filename]).catch((error) => {
    throw new NxError(
      `Removing temporary ${filename} failed. \n ${error.stderr}`
    );
  });
  return nxGraph;
}

/**
 * NOTE: For publish, we only consider `private: false` packages (client will not be included)
 * @returns {Promise<import('./typedefs.mjs').Package[]>}
 */
export async function getAffectedPackages() {
  const channel = detectChannel();
  // the source code for these packages have been updated.
  const onlyChangedPackages = await getChangedPackagesFor(channel);
  // changes will affect other packages as well, this is the full list.
  const allAffectedPackages = await analyzeChangesEffects(onlyChangedPackages);

  return allAffectedPackages;
}
