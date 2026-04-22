import { ALL_HOST_CONFIGS } from '../../hosts/index';

/**
 * Host type — derived from host configs in hosts/*.ts.
 * Adding a new host: create hosts/myhost.ts + add to hosts/index.ts.
 * Do NOT hardcode host names here.
 */
export type Host = (typeof ALL_HOST_CONFIGS)[number]['name'];

export interface HostPaths {
  skillRoot: string;
  localSkillRoot: string;
  binDir: string;
  browseDir: string;
  designDir: string;
  makePdfDir: string;
}

/**
 * HOST_PATHS — derived from host configs.
 * Each config's globalRoot/localSkillRoot determines the path structure.
 * Non-Claude hosts use $REZOPS_ROOT env vars (set by preamble).
 */
function buildHostPaths(): Record<string, HostPaths> {
  const paths: Record<string, HostPaths> = {};
  for (const config of ALL_HOST_CONFIGS) {
    if (config.usesEnvVars) {
      paths[config.name] = {
        skillRoot: '$REZOPS_ROOT',
        localSkillRoot: config.localSkillRoot,
        binDir: '$REZOPS_BIN',
        browseDir: '$REZOPS_BROWSE',
        designDir: '$REZOPS_DESIGN',
        makePdfDir: '$REZOPS_MAKE_PDF',
      };
    } else {
      const root = `~/${config.globalRoot}`;
      paths[config.name] = {
        skillRoot: root,
        localSkillRoot: config.localSkillRoot,
        binDir: `${root}/bin`,
        browseDir: `${root}/browse/dist`,
        designDir: `${root}/design/dist`,
        makePdfDir: `${root}/make-pdf/dist`,
      };
    }
  }
  return paths;
}

export const HOST_PATHS: Record<string, HostPaths> = buildHostPaths();

import type { Model } from '../models';
export type { Model } from '../models';

export interface TemplateContext {
  skillName: string;
  tmplPath: string;
  benefitsFrom?: string[];
  host: Host;
  paths: HostPaths;
  preambleTier?: number;  // 1-4, controls which preamble sections are included
  model?: Model;  // model family for behavioral overlay. Omitted/undefined → no overlay.
}

/** Resolver function signature. args is populated for parameterized placeholders like {{INVOKE_SKILL:name}}. */
export type ResolverFn = (ctx: TemplateContext, args?: string[]) => string;
