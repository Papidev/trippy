<template>
  {{ selectedMarker }}

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
import { GeoJSONFeature, Map, Marker, Popup } from 'maplibre-gl';
import { shallowRef, onMounted, onUnmounted, Raw } from 'vue';
import { addToMap, initMap } from '@/utils/map/Map';
import { getAttractionsQuery } from '@/utils/map/Queries';
import { GetAttractionsQuery } from '~~/types/models/strapi/graphql';
import { GeoJsonSource } from '~~/types/Map/Map';
import { Point } from 'geojson';
// import { GeoJsonSource } from '~~/types/Map/Map';

const mapContainer = shallowRef(null);
const map = shallowRef<Raw<Map> | null>(null);
const selectedMarker = ref<string | null>(null);

const variables = { limit: ATTRACTIONS_LIMIT };
const attractionsResult = await useAsyncQuery<GetAttractionsQuery>(
  getAttractionsQuery,
  variables
);
const attractions = attractionsResult.data.value?.attractions?.data;
const geoJson: GeoJsonSource = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [],
  },
};
onMounted(() => {
  if (mapContainer?.value) {
    map.value = initMap(mapContainer.value);
    addToMap(map.value);
  }
  //   new Marker({ color: '#FF0000' })
  //     .setLngLat([139.7525, 35.6841])
  //     .addTo(map.value);
});

onUnmounted(() => {
  map.value?.remove();
});

watchEffect(() => {
  if (attractions && attractions.length > 0 && map?.value) {
    const geoFeatures = attractions.map((attr): GeoJSON.Feature => {
      return {
        geometry: {
          coordinates: [
            attr.attributes?.longitude!,
            attr.attributes?.latitude!,
          ],
          type: 'Point',
        },
        type: 'Feature',
        properties: {
          description: attr.attributes?.name,
        },
      };
    });

    geoJson.data.features = geoFeatures;

    if (map && map.value) {
      map.value.on('load', () => {
        // Add an image to use as a custom marker

        map.value!.loadImage(
          'https://maplibre.org/maplibre-gl-js-docs/assets/osgeo-logo.png',
          (error, image) => {
            if (error) throw error;
            if (image) {
              map.value!.addImage('custom-marker', image);
            }
            // Add a GeoJSON source with 15 points
            map.value!.addSource('conferences', geoJson);

            // Add a symbol layer
            map.value!.addLayer({
              id: 'conferences',
              type: 'symbol',
              source: 'conferences',
              layout: {
                'icon-image': 'custom-marker',
                // get the year from the source's "year" property
                'text-field': ['get', 'year'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25],
                'text-anchor': 'top',
              },
            });
          }
        );
        map.value!.on('click', 'conferences', e => {
          if (e.features) {
            const coordinates = (
              e.features[0].geometry as Point
            ).coordinates.slice();
            const description = e.features?.[0]?.properties?.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new Popup()
              .setLngLat(coordinates as [number, number])
              .setHTML(description)
              .addTo(map.value!);
          }
        });
      });
    }

    // Add a GeoJSON source with 15 points
    // map.value.addSource('conferences', geoJson);
    // map.value.addLayer({
    //   id: 'conferences',
    //   type: 'symbol',
    //   source: 'conferences',
    //   layout: {
    //     // 'icon-image': 'custom-marker',
    //     // get the year from the source's "year" property
    //     'text-field': ['get', 'year'],
    //     'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //     'text-offset': [0, 1.25],
    //     'text-anchor': 'top',
    //   },
    // });
  }
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
