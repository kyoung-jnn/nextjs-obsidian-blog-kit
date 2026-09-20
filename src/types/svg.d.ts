import type { SVGProps } from 'react';

declare module '*.svg' {
  const SvgComponent: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  export default SvgComponent;
}
