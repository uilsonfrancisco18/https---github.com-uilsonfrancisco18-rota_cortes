declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';

  type IconProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };

  export const Calendar: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const DollarSign: FC<IconProps>;
  export const Trash2: FC<IconProps>;
  export const AlertCircle: FC<IconProps>;
  export const Scissors: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const X: FC<IconProps>;
}
