/**
 * Ambiente HDRI — Caricamento della environment map equirettangolare.
 *
 * Un'immagine HDRI (High Dynamic Range Image) fotografata a 360°
 * viene usata sia come sfondo della scena che come sorgente di luce
 * ambientale per i materiali PBR.
 *
 * Il PMREMGenerator (Prefiltered Mipmapped Radiance Environment Map)
 * calcola versioni sfocate della texture per simulare riflessioni
 * con diversi livelli di roughness sui materiali.
 */
//import { HDRLoader } from 'three/examples/jsm/Addons.js'
import { PMREMGenerator, Scene, WebGPURenderer } from 'three/webgpu'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { Euler } from 'three/webgpu'

import exrUrl from '../assets/hdrmaps_com_free_10K.exr?url'

export async function loadEnvironment (scene: Scene, renderer: WebGPURenderer) {
  renderer.toneMappingExposure = 0.7
  
  const pmremGenerator = new PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  // const hdrLoader = new HDRLoader()
  // const hdrTexture = await hdrLoader.loadAsync(hdrUrl)

  const exrLoader = new EXRLoader()
  const exrTexture = await exrLoader.loadAsync(exrUrl)

  const envMap = pmremGenerator.fromEquirectangular(exrTexture).texture
  
  const rotation = new Euler(0, 160)

  scene.environment = envMap
  scene.environmentRotation = rotation

  scene.background = envMap
  scene.backgroundRotation = rotation

  // Le risorse intermedie non servono più: liberiamo la memoria GPU.
  exrTexture.dispose()
  pmremGenerator.dispose()
}
