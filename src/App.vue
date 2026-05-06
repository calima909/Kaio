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

const hotspotIds = Object.keys(hotspots) as (keyof typeof hotspots)[]

const canvasContainer = ref<HTMLElement | null>(null)
const cleanup = ref<(() => void) | null>(null)
const route = useRoute()

// Gli hotspot sono visibili solo sulla rotta home (nessun overlay aperto)
const showHotspots = computed(() => route.path === '/')

onMounted(async () => {
  if (!canvasContainer.value) return
  cleanup.value = await initScene(canvasContainer.value)
})

onUnmounted(() => {
  cleanup.value?.()
})
</script>

<template>
  <!-- Contenitore del canvas WebGPU: occupa tutta la viewport -->
  <div
    ref="canvasContainer"
    class="fixed inset-0 z-0"
  />

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

<style>
/* Global styles */
html, body, #app { height: 100%; }
body { overflow: hidden; background: #000; }
</style>

<style scoped>
/* Fade transition for the router view */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.45s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* transition for the hotspot group */
.hotspot-group-enter-active, .hotspot-group-leave-active {
  transition: opacity 0.45s ease;
}

/* stagger on enter */
.hotspot-group-enter-active {
  transition-delay: calc(var(--stagger, 0) * 500ms);
}
/* no stagger on leave */
.hotspot-group-leave-active {
  transition-delay: 0;
}
.hotspot-group-enter-from,
.hotspot-group-leave-to {
  opacity: 0;
}
</style>
