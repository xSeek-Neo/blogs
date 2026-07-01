import { Callout } from '@rspress/core/theme-original';

import styles from './HomeAbout.module.css';

export function HomeAbout() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.about}>
        <h2 className={styles.title}>
          关于<del>博客</del>笔记
        </h2>
        <Callout type="warning" title="WARNING">
          这根本不是什么博客，仅仅是一个个人笔记而已。 更新频率要按公司加班多少而定。
        </Callout>
        <p className={styles.copyright}>版权所有 © 2025 xSeek. All rights reserved.</p>
        <p className={styles.icp}>
          ICP证：
          <a href="https://icp.chinaz.com/home/info" target="_blank" rel="noopener noreferrer">
            浙ICP备2023025841号
          </a>
        </p>
      </section>
    </div>
  );
}
