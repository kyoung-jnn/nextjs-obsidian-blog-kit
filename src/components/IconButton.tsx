import type { ComponentProps } from 'react';

import Icon from '@/components/Icon';

interface Props extends ComponentProps<'button'> {
  name: ComponentProps<typeof Icon>['name'];
}

function IconButton({ name, ...attributes }: Props) {
  return (
    <button
      className="hover:bg-gray-5 dark:hover:bg-gray-5 flex h-fit w-fit cursor-pointer rounded-[3px] p-[3px] transition-all duration-400"
      {...attributes}
    >
      <Icon name={name} />
    </button>
  );
}

export default IconButton;
