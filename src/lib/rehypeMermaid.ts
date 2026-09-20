interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function hasClass(node: HastNode, className: string): boolean {
  const classes = node.properties?.className;

  if (typeof classes === 'string') return classes.split(' ').includes(className);
  if (Array.isArray(classes)) return classes.includes(className);

  return false;
}

function transformNode(node: HastNode): void {
  const [firstChild] = node.children || [];

  if (node.tagName === 'pre' && firstChild?.tagName === 'code' && hasClass(firstChild, 'language-mermaid')) {
    node.properties = { className: ['mermaid'] };
    node.children = firstChild.children;
    return;
  }

  node.children?.forEach(transformNode);
}

/** Converts Mermaid code fences into nodes rendered by the client-side Mermaid runtime. */
function rehypeMermaid() {
  return (tree: HastNode) => transformNode(tree);
}

export default rehypeMermaid;
