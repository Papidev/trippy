export type GeoFeature = {
  type: 'Feature';
  properties: {
    description?: string;
    icon?: 'music';
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export type GeoFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoFeature[];
};

export type GeoJsonSource = {
  type: 'geojson';
  data: GeoFeatureCollection;
};
