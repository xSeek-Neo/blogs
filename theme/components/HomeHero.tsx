import { useFrontmatter } from '@rspress/core/runtime'
import { Link, renderHtmlOrText, useLinkNavigate } from '@rspress/core/theme'
import { useState } from 'react'

import { hasAuthSession, LOGIN_REDIRECT, setAuthSession } from '../utils/auth'
import { HeroInteractive } from './HeroInteractive'
import { LoginModal } from './LoginModal'

const DEFAULT_HERO = {
  badge: '',
  name: '',
  text: '',
  tagline: '',
  actions: [],
  image: undefined,
}

const LOGIN_ACTION_LINK = LOGIN_REDIRECT

export function HomeHero() {
  const { frontmatter } = useFrontmatter()
  const hero = frontmatter?.hero || DEFAULT_HERO
  const navigate = useLinkNavigate()
  const [loginOpen, setLoginOpen] = useState(false)

  const multiHeroText = hero.text
    ? hero.text
        .toString()
        .split(/\n/g)
        .filter((text) => text !== '')
    : []

  const openLoginOrNavigate = () => {
    if (hasAuthSession()) {
      navigate(LOGIN_REDIRECT)
      return
    }
    setLoginOpen(true)
  }

  const handleLoginSuccess = () => {
    setAuthSession()
    setLoginOpen(false)
    navigate(LOGIN_REDIRECT)
  }

  return (
    <>
      <div className="rp-home-hero">
        <div className="rp-home-hero__container">
          {hero.badge &&
            (typeof hero.badge === 'string' ? (
              <div className="rp-home-hero__badge">{hero.badge}</div>
            ) : hero.badge.link ? (
              <Link href={hero.badge.link} className="rp-home-hero__badge">
                {hero.badge.text}
              </Link>
            ) : (
              <div className="rp-home-hero__badge">{hero.badge.text}</div>
            ))}
          <div className="rp-home-hero__content">
            <div className="rp-home-hero__title">
              <span className="rp-home-hero__title-brand" {...renderHtmlOrText(hero.name)} />
            </div>
            {multiHeroText.map((heroText) => (
              <div
                key={heroText}
                className="rp-home-hero__subtitle"
                {...renderHtmlOrText(heroText)}
              />
            ))}
          </div>
          {hero.tagline ? (
            <p className="rp-home-hero__tagline" {...renderHtmlOrText(hero.tagline)} />
          ) : null}
          <div className="rp-home-hero__actions">
            {hero.actions?.map((action) => {
              const isLoginAction = action.link === LOGIN_ACTION_LINK

              if (isLoginAction) {
                return (
                  <button
                    key={action.link}
                    type="button"
                    className={`rp-button rp-button--${action.theme || 'brand'} rp-button--big rp-home-hero__action`}
                    onClick={openLoginOrNavigate}
                  >
                    {action.text}
                  </button>
                )
              }

              return (
                <a
                  key={action.link}
                  href={action.link}
                  className={`rp-button rp-button--${action.theme || 'brand'} rp-button--big rp-home-hero__action`}
                  {...renderHtmlOrText(action.text)}
                />
              )
            })}
          </div>
        </div>
        <div className="rp-home-hero__image">
          <HeroInteractive />
        </div>
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
