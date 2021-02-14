/*global google*/
import React, { useState, useRef, useEffect } from 'react'
import { move } from '../utils/socket'

import Marker from '../components/Marker'

import styles from '../css/Map.module.css'

const defaultCenter = { lat: 49.28273, lng: -123.120735 }
const dlat = 0.0005
const dlng = 0.001

const Map = ({ users, user, center = defaultCenter }) => {
  const mapDomRef = useRef(null)
  const [map, setMap] = useState(null)
  const [currLoc, setLoc] = useState(center)

  const onClick = id => {
    console.log(id)
  }
  console.log(currLoc)
  const keyDownHandler = e => {
    switch (e.keyCode) {
      case 37:
        console.log('left key')
        setLoc({ lat: currLoc.lat, lng: currLoc.lng - dlng })
        break
      case 38:
        console.log('up key')
        setLoc({ lat: currLoc.lat + dlat, lng: currLoc.lng })
        break
      case 39:
        console.log('right key')
        setLoc({ lat: currLoc.lat, lng: currLoc.lng + dlng })
        break
      case 40:
        console.log('down key')
        setLoc({ lat: currLoc.lat - dlat, lng: currLoc.lng })
        break
      default:
    }
  }

  useEffect(() => {
    setMap(
      new google.maps.Map(mapDomRef.current, {
        zoom: 11,
        center: defaultCenter,
        keyboardShortcuts: false
      })
    )
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  useEffect(() => {
    move(currLoc)
  }, [currLoc])

  return (
    <div ref={mapDomRef} className={styles.map}>
      <Marker
        map={map}
        onClick={onClick}
        loc={currLoc}
        id="123"
        name="test123"
      />
      {/* {users?.map?.(user => (
        <Marker key={user.id} map={map} onClick={onClick} {...user} />
      ))} */}
    </div>
  )
}

export default Map
