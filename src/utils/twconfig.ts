import type { Config } from 'tailwindcss';
import resolveConfig from 'tailwindcss/resolveConfig';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

import tailwindConfig from '~/tailwind.config';

type Colors = DefaultColors & {
  dark: string;
  primary: string;
};

export const twFullConfig = resolveConfig(tailwindConfig as Config);

export const colors = twFullConfig.theme.colors as Colors;
