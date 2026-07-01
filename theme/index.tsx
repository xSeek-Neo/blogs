import { HomeLayout as BasicHomeLayout, Layout as BasicLayout } from '@rspress/core/theme-original'

import { AuthLogout } from './components/AuthLogout'
import { HomeAbout } from './components/HomeAbout'
import { HomeFeatureCards } from './components/HomeFeatureCards'
import { HomeHero } from './components/HomeHero'
import './index.css'
import '@rspress/core/theme-original/components/Button/index.css'
import '@rspress/core/theme-original/components/HomeHero/index.css'

function Layout() {
  return <BasicLayout afterNavMenu={<AuthLogout />} />
}

function HomeLayout() {
  return <BasicHomeLayout afterFeatures={<HomeAbout />} />
}

function HomeFeature() {
  return <HomeFeatureCards />
}

export * from '@rspress/core/theme-original'
export { HomeHero, HomeLayout, HomeFeature, Layout }
