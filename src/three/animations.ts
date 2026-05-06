import type { Group } from 'three/webgpu'

import { Object3D } from 'three/webgpu'
import type { WaterCone } from './waterFountain'


/**
 * Animazioni procedurali — Movimento degli oggetti nel parco.
 *
 * Invece di usare animazioni pre-registrate nel GLB (AnimationMixer),
 * qui calcoliamo le trasformazioni frame-per-frame con funzioni
 * trigonometriche. Questo approccio è perfetto per movimenti
 * ciclici semplici e non richiede dati aggiuntivi nel file 3D.
 *
 * I nomi degli oggetti ("Rock_1", "carousel", "horse") corrispondono
 * ai nomi assegnati in Blender ed esportati nel GLB.
 */

export interface SceneAnimations {
  car: Object3D
  pivot: Object3D
  fountain?: WaterCone
}

export function createAnimations (model: Group, fountain?: WaterCone): SceneAnimations {

  const car = model.getObjectByName('macchina')
  const pivot = model.getObjectByName('pivot')

  return {
    car: car ?? new Object3D(),
    pivot: pivot ?? new Object3D(),
    fountain
  }
}

// Parametri delle animazioni — costanti per leggibilità
const carSpeed = 0.8

// Flag per il controllo della macchina
let carDirection = 0 // 1 = avanti, -1 = indietro, 0 = fermo
let carStart = false

// Flag per il controllo della fontana
let isFountainOn = false

// Setup listener per i controlli tastiera della macchina
export function setupControls (): void {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
      e.preventDefault()
      carDirection = 1
      carStart = true
    } else if (e.code === 'ArrowDown') {
      e.preventDefault()
      carDirection = -1
      carStart = false
    } else if (e.code === 'Space') {
      e.preventDefault()
      isFountainOn = !isFountainOn
    }   
  })

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      carDirection = 0
    }
  })
}


export function updateAnimations (anim: SceneAnimations, elapsed: number, delta: number): void {
  // Animazione della macchina
  if (carDirection !== 0) {
    anim.pivot.rotation.z += carSpeed * delta * carDirection
  }
  else if (carStart) {
    anim.pivot.rotation.z += 0.2 * delta
  }
  // Animazione della fontana
  if (anim.fountain) {
    if (isFountainOn) {
      anim.fountain.mesh.visible = true
      anim.fountain.mesh.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.05
    }
    else {
      anim.fountain.mesh.visible = false
    }
  }  
}