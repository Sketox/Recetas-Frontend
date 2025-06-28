import React from 'react';
import Navbar from '../../components/navbar';
import styles from './style.module.css';

const AboutUsPage = () => {
  return (
    <>
      <Navbar /> {/* Incluye el Navbar aquí */}
      <div className={styles.container}>
        {/* Sección superior con título */}
        <header className={styles.header}>
          <h1 className={styles.mainTitle}>Sobre Nosotros</h1>
        </header>

        {/* Sección principal de contenido con grilla */}
        <section className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Sobre Nosotros</h2>
          <div className={styles.gridContainer}>
            {/* Bloque 1 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>
            {/* Bloque 2 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
            {/* Bloque 3 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Sunt in culpa qui officia deserunt mollit anim id est laborum.
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                odit aut fugit.
              </p>
            </div>
            {/* Bloque 4 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt.
              </p>
            </div>
            {/* Bloque 5 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Ut enim ad minima veniam, quis nostrum exercitationem ullam
                corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                consequatur.
              </p>
            </div>
            {/* Bloque 6 */}
            <div className={styles.gridItem}>
              <div className={styles.imagePlaceholder}></div>
              <p className={styles.textPlaceholder}>
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit
                esse quam nihil molestiae consequatur, vel illum qui dolorem
                eum.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUsPage;