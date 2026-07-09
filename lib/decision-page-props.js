import fs from 'fs';
import path from 'path';
import { DECISION_PAGES } from './decision-pages';
import { toCardTool } from './tool-data';

export function getDecisionPageStaticProps(slug) {
  const config = DECISION_PAGES[slug];
  if (!config) return { notFound: true };

  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const byId = new Map(tools.map(tool => [tool.id, tool]));

  const targetTool = config.targetId ? byId.get(config.targetId) || null : null;
  const selectedTools = (config.toolIds || []).map(id => byId.get(id)).filter(Boolean);

  return {
    props: {
      slug,
      config,
      targetTool: targetTool ? toCardTool(targetTool) : null,
      tools: selectedTools.map(toCardTool),
    },
  };
}
