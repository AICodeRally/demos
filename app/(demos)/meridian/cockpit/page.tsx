import { CockpitPage } from '@/components/shell/cockpit/CockpitPage';
import demoConfig from '../demo.config';

export default function Page() {
  return <CockpitPage config={demoConfig} />;
}
