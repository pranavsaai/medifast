/* components/ui/BgOrbs.tsx */
import styles from './BgOrbs.module.css';

export default function BgOrbs() {
  return (
    <div className={styles.orbs} aria-hidden="true">
      <span className={styles.orb1} />
      <span className={styles.orb2} />
      <span className={styles.orb3} />
    </div>
  );
}