import 'katex/dist/katex.min.css';

import ImageViewer from './ImageViewer';
import MermaidRenderer from './MermaidRenderer';
import './MarkdownRender.css';

interface Props {
  html: string;
}

function MarkdownRender({ html }: Props) {
  return (
    <>
      <article className="markdown-render" dangerouslySetInnerHTML={{ __html: html }} />
      <ImageViewer />
      <MermaidRenderer />
    </>
  );
}

export default MarkdownRender;
