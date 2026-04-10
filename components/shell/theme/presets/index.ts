import type { ThemePresetDef, ThemePresetName } from '../types';

export { barrelBrass } from './barrel-brass';
export { midnight } from './midnight';
export { cleanLight } from './clean-light';
export { aegisIvory } from './aegis-ivory';
export { registerSlate } from './register-slate';
export { charterStone } from './charter-stone';
export { prizymNavy } from './prizym-navy';
export { phoenixSapphire } from './phoenix-sapphire';
export { sgmGlass } from './sgm-glass';

import { barrelBrass } from './barrel-brass';
import { midnight } from './midnight';
import { cleanLight } from './clean-light';
import { aegisIvory } from './aegis-ivory';
import { registerSlate } from './register-slate';
import { charterStone } from './charter-stone';
import { prizymNavy } from './prizym-navy';
import { phoenixSapphire } from './phoenix-sapphire';
import { sgmGlass } from './sgm-glass';

export const PRESETS: Record<ThemePresetName, ThemePresetDef> = {
  'barrel-brass': barrelBrass,
  'midnight': midnight,
  'clean-light': cleanLight,
  'aegis-ivory': aegisIvory,
  'register-slate': registerSlate,
  'charter-stone': charterStone,
  'prizym-navy': prizymNavy,
  'phoenix-sapphire': phoenixSapphire,
  'sgm-glass': sgmGlass,
};
