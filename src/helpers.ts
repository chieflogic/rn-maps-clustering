import React from 'react'
import type {Region} from 'react-native-maps'
import type {ClusterFeature, InputPointFeature, PointFeature} from './types'

export const isMarker = (
  child: React.ReactNode
): child is React.ReactElement<{
  coordinate: {latitude: number; longitude: number}
}> => {
  return (
    React.isValidElement(child) &&
    child.props !== null &&
    typeof child.props === 'object' &&
    'coordinate' in child.props
  )
}

export const markerToGeoJSONFeature = (
  marker: React.ReactElement<{
    coordinate: {latitude: number; longitude: number}
  }>,
  key: string
): InputPointFeature => {
  const {coordinate, ...props} = marker.props
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinate.longitude, coordinate.latitude],
    },
    properties: {
      key,
      ...props,
    },
  }
}

export const generateSpiral = (
  center: ClusterFeature,
  leaves: PointFeature[]
): Array<{
  longitude: number
  latitude: number
  key: string
  centerPoint: {longitude: number; latitude: number}
}> => {
  const centerLocation = center.geometry.coordinates
  const res: Array<{
    longitude: number
    latitude: number
    key: string
    centerPoint: {longitude: number; latitude: number}
  }> = []
  let angle = 0
  const separation = 0.00015

  for (let i = 0; i < leaves.length; i++) {
    angle = 0.5 * i
    const latitude = centerLocation[1] + separation * angle * Math.cos(angle)
    const longitude = centerLocation[0] + separation * angle * Math.sin(angle)

    const leaf = leaves[i]
    if (leaf) {
      res.push({
        key: leaf.properties.key,
        longitude,
        latitude,
        centerPoint: {
          latitude: centerLocation[1],
          longitude: centerLocation[0],
        },
      })
    }
  }
  return res
}

export const calculateBBox = (region: Region): [number, number, number, number] => {
  const westLng = region.longitude - region.longitudeDelta / 2
  const southLat = region.latitude - region.latitudeDelta / 2
  const eastLng = region.longitude + region.longitudeDelta / 2
  const northLat = region.latitude + region.latitudeDelta / 2
  return [westLng, southLat, eastLng, northLat]
}

export const returnMapZoom = (region: Region, width: number): number => {
  return Math.round(Math.log2(360 / region.longitudeDelta) * (width / 256))
}

export const returnMarkerStyle = (
  points: number
): {width: number; height: number; fontSize: number; size: number} => {
  if (points >= 50) return {width: 84, height: 84, size: 64, fontSize: 20}
  if (points >= 25) return {width: 78, height: 78, size: 58, fontSize: 19}
  if (points >= 15) return {width: 72, height: 72, size: 54, fontSize: 18}
  if (points >= 10) return {width: 66, height: 66, size: 50, fontSize: 17}
  if (points >= 4) return {width: 54, height: 54, size: 40, fontSize: 16}
  return {width: 48, height: 48, size: 36, fontSize: 15}
}
