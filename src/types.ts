import type Supercluster from 'supercluster'

export type InputPointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  {
    key: string
    [key: string]: any
  }
>

export type ClusterFeature = Supercluster.ClusterFeature<{}>
export type PointFeature = Supercluster.PointFeature<{key: string}>
