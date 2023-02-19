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
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { shallowRef, onMounted, onUnmounted, markRaw, Raw } from 'vue';

const mapContainer = shallowRef(null);
const map = shallowRef<Raw<Map> | null>(null);

onMounted(() => {
  const apiKey = 'AgQ7PM8YD5zEZghQORfd';

  const initialState = { lng: 2.349902, lat: 48.852966, zoom: 14 };

  if (mapContainer?.value) {
    map.value = markRaw(
      new Map({
        container: mapContainer.value,
        style: `https://api.maptiler.com/maps/81778db5-d7c4-4ae9-9974-6d1eb0c8de02/style.json?key=${apiKey}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom,
      })
    );
    map.value.addControl(new NavigationControl({}), 'top-right');
  }
  //   new Marker({ color: '#FF0000' })
  //     .setLngLat([139.7525, 35.6841])
  //     .addTo(map.value);
});

const query = gql`
  query getAttractions {
    attractions {
      data {
        id
        attributes {
          name
          latitude
          longitude
        }
      }
    }
  }
`;
const variables = { limit: 5 };
const { data } = await useAsyncQuery(query, variables);

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
