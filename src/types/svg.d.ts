declare module '*.svg' {
  import type { SVGProps } from 'react';

  const SvgComponent: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  export default SvgComponent;
}
