import {
  HomeHero as BasicHomeHero,
  HomeLayout as BasicHomeLayout,
  type HomeHeroProps,
} from '@rspress/core/theme-original';

import { HeroInteractive } from './components/HeroInteractive';
import { HomeAbout } from './components/HomeAbout';
import { HomeFeatureCards } from './components/HomeFeatureCards';
import './index.css';

function HomeHero({ image: _, ...otherProps }: HomeHeroProps) {
  return <BasicHomeHero image={<HeroInteractive />} {...otherProps} />;
}

function HomeLayout() {
  return <BasicHomeLayout afterFeatures={<HomeAbout />} />;
}

function HomeFeature() {
  return <HomeFeatureCards />;
}

export * from '@rspress/core/theme-original';
export { HomeHero, HomeLayout, HomeFeature };
