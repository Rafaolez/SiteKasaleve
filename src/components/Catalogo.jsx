import { useState } from 'react';
import SwatchCard from './SwatchCard';
import styles from './Catalogue.module.css';
import { COLORS, COLOR_GROUPS } from '../data/colors';
import { ropeImages } from '../assets/imageData';

const filtere = [
  { key: 'all',    label: 'Todas' },
  { key: 'quente', label: 'Tons Quentes' },
  { key: 'neutro', label: 'Neutros & Naturais' },
  { key: 'frio',   label: 'Tons Frios' },
  { key: 'escuro', label: 'Escuros' },
];

export default function Catalogue() {
  const [active, setActive] = useState('all');

  const visible = COLORS.filter(
    (c) => active === 'all' || COLOR_GROUPS[active]?.includes(c.name)
  );

  return (
    <section className={styles.catalogue}>
      {/* Section header */}
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Paleta completa</p>
          <h2 className={styles.title}>
            Encontre sua<br />
            <em>cor ideal</em>
          </h2>
        </div>
        <span className={styles.count}>{visible.length.toString().padStart(2, '0')}</span>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar} role="group" aria-label="Filtros de cor">
        {filtere.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${active === f.key ? styles.filterActive : ''}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {visible.map((color, i) => {
          const globalIdx = COLORS.indexOf(color);
          return (
            <SwatchCard
              key={color.name}
              index={i}
              name={color.name}
              hex={color.hex}
              material={color.material}
              image={ropeImages[globalIdx]}
            />
          );
        })}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.brand}>
          <em>Kasa</em>leve
        </div>
        <p className={styles.footerNote}>
          Todas as cores disponíveis sob encomenda<br />
          kasaleve.com.br
        </p>
      </footer>
    </section>
  );
}
