import type { Feature } from '@rspress/core'
import { normalizeImagePath, useFrontmatter } from '@rspress/core/runtime'
import { useLinkNavigate } from '@rspress/core/theme'

import styles from './HomeFeatureCards.module.css'

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon, title, details, link } = feature
  const navigate = useLinkNavigate()
  const linkText =
    'linkText' in feature && typeof feature.linkText === 'string'
      ? feature.linkText
      : link?.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const content = (
    <>
      {icon ? (
        <img className={styles.logo} src={normalizeImagePath(icon)} alt={title} loading="lazy" />
      ) : null}
      <div className={styles.title}>{title}</div>
      <p className={styles.description}>{details}</p>
      {link && linkText ? <div className={styles.url}>{linkText}</div> : null}
    </>
  )

  if (link) {
    const isExternal = /^https?:\/\//.test(link)

    if (isExternal) {
      return (
        <a className={styles.card} href={link} target="_blank" rel="noreferrer">
          {content}
        </a>
      )
    }

    return (
      <a
        className={styles.card}
        href={link}
        onClick={(event) => {
          event.preventDefault()
          navigate(link)
        }}
      >
        {content}
      </a>
    )
  }

  return <div className={styles.card}>{content}</div>
}

export function HomeFeatureCards({ features: featuresProp }: { features?: Feature[] }) {
  const { frontmatter } = useFrontmatter()
  const features = featuresProp ?? frontmatter?.features
  const intro =
    typeof frontmatter?.featuresIntro === 'string' ? frontmatter.featuresIntro : undefined

  if (!features?.length) {
    return null
  }

  return (
    <section className={styles.section}>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
      <div className={styles.grid}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}
