import type { ComponentProps } from 'react';

import { type IconName, svg } from '@/components/Icon/svg';

interface Props extends ComponentProps<'svg'> {
  name: IconName;
}

function Icon({ name, ...attributes }: Props) {
  const Component = svg[name];
  return <Component {...attributes} />;
}

export default Icon;
