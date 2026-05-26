import styles from './Hero.module.css';
import { heroImage } from '../assets/imageData';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imgCol}>
        <img src={heroImage} alt="Kasaleve — Ambiente" />
      </div>

      <div className={styles.textCol}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          Kasaleve
        </p>

        <h1 className={styles.title}>
          Mostruário<br />
          de <em>Cores</em>
        </h1>

        <p className={styles.subtitle}>Coleção de Cordas Artesanais</p>

        <p className={styles.desc}>
          Cada cor é cuidadosamente selecionada para harmonizar com ambientes
          contemporâneos. Nossas cordas de algodão 100% natural trazem textura,
          calor e autenticidade para cada criação.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>18</span>
            <small>Cores disponíveis</small>
          </div>
          <div className={styles.stat}>
            <span>100%</span>
            <small>Algodão natural</small>
          </div>
          <div className={styles.stat}>
            <span>♻</span>
            <small>Sustentável</small>
          </div>
        </div>
      </div>
    </section>
  );
}
