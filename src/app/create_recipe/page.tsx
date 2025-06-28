'use client';

import React from 'react';
import Navbar from '../../components/navbar';
import styles from './styles.module.css';

export default function CreateRecipePage() {
  return (
    <>
      {/* Tu componente Navbar existente (asume que ya tiene sus propios estilos) */}
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.gridLayout}>
          {/* Sección de subir imágenes */}
          <div className={`${styles.gridItemLeft} ${styles.panel}`}>
            <div className={styles.imageUploadPlaceholder}>
              <button className={styles.btnPrimary}>
                + Subir imágenes
              </button>
            </div>
          </div>

          {/* Sección de detalles de la receta */}
          <div className={`${styles.gridItemRight} ${styles.panel}`}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre de la receta</label>
              <input type="text" className={styles.inputText} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción de la receta</label>
              <textarea className={styles.textareaText}></textarea>
            </div>
            <div className={styles.timeAndPortionGroup}>
              <div className={styles.timeItem}>
                <span className={styles.icon}>⏱️</span>
                <input type="text" placeholder="Preparación" className={styles.inputText} />
              </div>
              <div className={styles.timeItem}>
                <span className={styles.icon}>🔥</span>
                <input type="text" placeholder="Cocción" className={styles.inputText} />
              </div>
            </div>
            <div className={styles.difficultyAndPortionGroup}>
              <div className={styles.difficultyItem}>
                <span className={styles.icon}>⚙️</span>
                <select className={styles.inputText}>
                  <option>Dificultad</option>
                  <option>Fácil</option>
                  <option>Media</option>
                  <option>Difícil</option>
                </select>
              </div>
              <div className={styles.portionItem}>
                <span className={styles.icon}>👥</span>
                <input type="number" placeholder="Porciones" className={styles.inputText} />
              </div>
            </div>
          </div>

          {/* Sección de ingredientes */}
          <div className={`${styles.gridItemIngredients} ${styles.panel}`}>
            <h2 className={styles.sectionTitle}>Ingredientes</h2>
            <div className={styles.inputGroup}>
              <input type="checkbox" className={styles.checkbox} />
              <input type="text" placeholder="Ingresar ingrediente..." className={styles.inputText} />
            </div>
            <button className={styles.btnPrimarySmall}>
              + Nuevo ingrediente
            </button>
          </div>

          {/* Sección de instrucciones */}
          <div className={`${styles.gridItemInstructions} ${styles.panel}`}>
            <h2 className={styles.sectionTitle}>Instrucciones</h2>
            <div className={styles.instructionItem}>
              <span className={styles.stepNumber}>1</span>
              <textarea placeholder="Escribir instrucción..." className={styles.textareaText}></textarea>
            </div>
            <button className={styles.btnPrimarySmall}>
              + Ingresar nueva instrucción
            </button>
          </div>
        </div>

        {/* Botón subir receta */}
        <div className={styles.submitButtonContainer}>
          <button className={`${styles.submitButton} ${styles.btnPrimary}`}>
            Subir receta
          </button>
        </div>
      </main>
    </>
  );
}