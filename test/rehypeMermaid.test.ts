import assert from 'node:assert/strict';
import test from 'node:test';

import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import rehypeMermaid from '../src/lib/rehypeMermaid.ts';

test('turns Mermaid code blocks into Mermaid render targets', async () => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMermaid)
    .use(rehypeStringify)
    .process('```mermaid\nflowchart LR\n  A --> B\n```');

  assert.equal(String(result), '<pre class="mermaid">flowchart LR\n  A --> B\n</pre>');
});

test('leaves ordinary code blocks unchanged', async () => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMermaid)
    .use(rehypeStringify)
    .process('```typescript\nconst answer = 42;\n```');

  assert.equal(
    String(result),
    '<pre><code class="language-typescript">const answer = 42;\n</code></pre>',
  );
});
