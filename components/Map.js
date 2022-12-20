import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

const mapStyle = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d8f8f9',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'road.highway',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e6f5f4',
      },
      {
        visibility: 'on',
      },
      {
        weight: 3,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#D2E4E3',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#D2E4E3',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#E6F5F4',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#ffffff',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3E6964',
      },
      {
        lightness: 0,
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f2f2f2',
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#fefefe',
      },
      {
        lightness: 20,
      },
    ],
  },
  // {
  //   featureType: 'administrative',
  //   elementType: 'geometry.stroke',
  //   stylers: [
  //     {
  //       color: '#fefefe',
  //     },
  //     {
  //       lightness: 17,
  //     },
  //     {
  //       weight: 1.2,
  //     },
  //   ],
  // },
]

const Map = ({
  latitude,
  longitude,
  zoom,
  markers,
  isAside = false,
  isDraggable = true,
  isCornerRounded = false,
}) => {
  const [map, setMap] = useState(null)
  const [markersContainer, setMarkersContainer] = useState([])

  useEffect(() => {
    if (markers) {
      setMarkersContainer(markers)
    }
  }, [markers])

  const onLoad = useCallback(
    currentMap => {
      const bounds = new window.google.maps.LatLngBounds({ lat: latitude, lng: longitude })
      currentMap.setZoom(zoom)
      setMap(currentMap)
    },
    [latitude, longitude, zoom]
  )

  const onUnmount = useCallback(currentMap => {
    setMap(null)
  }, [])

  const memoMap = useMemo(() => {
    const containerStyle = {
      width: '100%',
      height: '100%',
      borderRadius: isAside ? '10px' : isCornerRounded ? '20px' : '0',
      zIndex: '0',
    }
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={{
          disableDefaultUI: true,
          styles: mapStyle,
          draggable: isDraggable,
          draggableCursor: isDraggable ? 'auto;' : 'cursor;',
        }}
        center={{ lat: latitude, lng: longitude }}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markersContainer}
        {markersContainer.length < 1 && (
          <Marker position={{ lat: latitude, lng: longitude }} clickable={false} />
        )}
      </GoogleMap>
    )
  }, [
    latitude,
    longitude,
    markersContainer,
    zoom,
    isAside,
    isDraggable,
    isCornerRounded,
    onLoad,
    onUnmount,
  ])

  return <>{memoMap}</>
}

export default Map
