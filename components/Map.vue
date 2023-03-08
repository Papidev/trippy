<template>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"
      ><img
        src="https://api.maptiler.com/resources/logo.svg"
        alt="MapTiler logo"
    /></a>
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import { Map, Marker } from 'maplibre-gl';
import { shallowRef, onMounted, onUnmounted, Raw } from 'vue';
import { addToMap, initMap } from '@/utils/map/Map';
import { getAttractionsQuery } from '@/utils/map/Queries';

const mapContainer = shallowRef(null);
const map = shallowRef<Raw<Map> | null>(null);

onMounted(() => {
  if (mapContainer?.value) {
    map.value = initMap(mapContainer.value);
    if (map?.value) {
      addToMap(map.value);
    }
  }
  //   new Marker({ color: '#FF0000' })
  //     .setLngLat([139.7525, 35.6841])
  //     .addTo(map.value);
});

const variables = { limit: ATTRACTIONS_LIMIT };
const { data } = await useAsyncQuery(getAttractionsQuery, variables);

onUnmounted(() => {
  map.value?.remove();
});
</script>

<style scoped>
/* @import '~maplibre-gl/dist/maplibre-gl.css'; */

.map-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}
</style>
