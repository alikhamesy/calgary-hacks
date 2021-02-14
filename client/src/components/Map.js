/*global google*/
import React, { useState, useRef, useEffect } from 'react'
import { move, roomRequest } from '../utils/socket'

import Marker from '../components/Marker'

import styles from '../css/Map.module.css'

const defaultCenter = { lat: 49.28273, lng: -123.120735 }
const dlat = 0.0005
const dlng = 0.001

const Map = ({ users, user, center = defaultCenter }) => {
  const mapDomRef = useRef(null)
  const [map, setMap] = useState(null)
  const [currLoc, setLoc] = useState(user?.loc)

  const onClick = uid => {
    roomRequest(uid)
  }

  const keyDownHandler = e => {
    switch (e.keyCode) {
      case 37:
        setLoc({ lat: currLoc.lat, lng: currLoc.lng - dlng })
        break
      case 38:
        setLoc({ lat: currLoc.lat + dlat, lng: currLoc.lng })
        break
      case 39:
        setLoc({ lat: currLoc.lat, lng: currLoc.lng + dlng })
        break
      case 40:
        setLoc({ lat: currLoc.lat - dlat, lng: currLoc.lng })
        break
      default:
    }
  }

  useEffect(() => {
    setMap(
      new google.maps.Map(mapDomRef.current, {
        zoom: 17,
        center: user?.loc ?? defaultCenter,
        keyboardShortcuts: false,
        disableDefaultUI: true
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

  useEffect(() => {
    setLoc(user?.loc)
    map && user?.loc && map.setCenter(user?.loc)
  }, [user, user?.loc])

  return (
    <div ref={mapDomRef} className={styles.map}>
      {currLoc && (
        <Marker
          {...user}
          map={map}
          onClick={onClick}
          loc={currLoc}
          username={user.username}
        />
      )}
      {users &&
        Object.entries(users)?.map?.(([uid, user]) => {
          return (
            <Marker
              key={uid}
              uid={uid}
              map={map}
              onClick={onClick}
              name="hi"
              {...user}
            />
          )
        })}
    </div>
  )
}

export default Map
