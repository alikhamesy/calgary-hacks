/*global google*/
import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'

import styles from '../css/Marker.module.css'

import defaultImg from '../assets/default-avatar.png'

const infowindow = new google.maps.InfoWindow({
  content: ''
})

const Marker = ({ map, loc, uid, onClick, ...props }) => {
  const { id, name, imgSrc, username, displayName } = props

  const [marker, setMarker] = useState(null)

  const info = ReactDOMServer.renderToString(
    <div className={styles.container}>
      <h3 className={styles.name}>{displayName}</h3>
      {/* <img src={imgSrc ?? defaultImg} alt="" /> */}
    </div>
  )

  useEffect(() => {
    if (!map) return

    const _marker = new google.maps.Marker({
      username,
      uid,
      map,
      position: loc,
      label: {
        text: `${displayName}`,
        className: styles.marker
      },
      info,
      icon: {
        path: 'M -40,-20 -40,20 40,20 40,-20 z',
        fillOpacity: 0,
        strokeOpacity: 0
      }
    })

    setMarker(_marker)

    return () => {
      _marker.setMap(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    const clickHandler = function () {
      // infowindow.close()
      // infowindow.setContent(this.info)
      // infowindow.open(map, this)
      onClick(this.uid)
    }
    let l
    if (marker) l = google.maps.event.addListener(marker, 'click', clickHandler)

    return () => {
      l && google.maps.event.removeListener(l)
    }
  }, [marker, map, onClick])

  useEffect(() => {
    loc && marker?.setPosition(loc)
  }, [marker, loc])

  return null
}

export default Marker
