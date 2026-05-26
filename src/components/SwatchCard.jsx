import { useState } from 'react';
import styles from './SwatchCard.module.css';

export default function SwatchCard({ name, hex, material, image, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      className={styles.card}
      style={{
        '--accent': hex,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div className={styles.imgWrap}>
        <img src={image} alt={`Corda ${name}`} loading="lazy" />
        <div className={styles.colorDot} style={{ background: hex }} />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{name}</span>

        <button className={styles.hexBtn} onClick={handleCopy} title="Copiar código">
          <span className={styles.hexCode}>{hex.toUpperCase()}</span>
          <span className={styles.copyHint}>{copied ? '✓ Copiado' : 'Copiar'}</span>
        </button>

        <span className={styles.material}>{material}</span>
      </div>

      <div className={styles.accentBar} />
    </article>
  );
}
