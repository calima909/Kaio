<!--
  Layers: z-0 canvas WebGPU -> marker HTML (z-10) -> router-view modali (z-50).
  Lista hotspot derivata dalle chiavi dello store (un solo elenco, niente duplicati).
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import HotspotMarker from '@/components/HotspotMarker.vue'
import { hotspots } from '@/store/hotspots'
import { initScene } from '@/three/index'

import { getMutedState, toggleMute } from '@/three/sounds.ts'
import { carForward, carBackward, toggleFountain, stopCar } from '@/three/animations.ts'

import './app.css'

const hotspotIds = Object.keys(hotspots) as (keyof typeof hotspots)[]

const canvasContainer = ref<HTMLElement | null>(null)
const cleanup = ref<(() => void) | null>(null)
const route = useRoute()

// Gli hotspot sono visibili solo sulla rotta home (nessun overlay aperto)
const showHotspots = computed(() => route.path === '/')

const isMuted = ref(getMutedState())

onMounted(async () => {
  if (!canvasContainer.value) return
  cleanup.value = await initScene(canvasContainer.value)
})

onUnmounted(() => {
  cleanup.value?.()
})

function handleToggleAudio() {
  isMuted.value = toggleMute()
}
</script>

<template>
  <!-- Contenitore del canvas WebGPU: occupa tutta la viewport -->
  <div
    ref="canvasContainer"
    class="fixed inset-0 z-0"
  />
  <!-- Bottone audio-mute -->
  <button
    class="audio-button"
    @pointerdown="handleToggleAudio"
  >
    <div class="dragon-stars stars-4">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="audio-icon">
      {{ isMuted ? '🔇' : '🔊' }}
    </div>
  </button>

  <!-- Controlli car -->
  <div class="car-controls">
    <button
      class="car-button"
      @pointerdown="carForward"
      @pointerup="stopCar"
      @pointercancel="stopCar"
      @pointerleave="stopCar"
    >
    <div class="dragon-stars stars-5">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
      <span>▲</span>
    </button>

    <button
      class="car-button"
      @pointerdown="carBackward"
      @pointerup="stopCar"
      @pointercancel="stopCar"
      @pointerleave="stopCar"
    >
    <div class="dragon-stars stars-6">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
      <span>▼</span>
    </button>
  </div>

  <button
    class="fountain-button"
    @pointerdown="toggleFountain"
    >
    <div class="dragon-stars stars-7">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
      <span>⛲</span>
  </button>

  <!-- In modalità dettaglio nascondiamo i marker: focus sul contenuto e meno rumore visivo. -->
  <TransitionGroup name="hotspot-group">
    <template v-if="showHotspots">
      <HotspotMarker
        v-for="(id, index) in hotspotIds"
        :id="id"
        :key="id"
        :route="`/hotspot/${id}`"
        :style="{ '--stagger': index + 1 }"
      />
    </template>
  </TransitionGroup>
  <!-- Overlay di dettaglio (montato dal router) -->
  <RouterView v-slot="{ Component }">
    <Transition name="fade">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>