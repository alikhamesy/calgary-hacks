import styles from '../css/Category.module.css'

import dropdownSrc from '../assets/dropdown.svg'
import { useState } from 'react'

const Category = ({ src, title, items, onClick }) => {
  const [open, setOpen] = useState(true)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div onClick={() => title === 'Home' && onClick()}>
          {src && <img src={src} className={styles.img} alt="" />}
          <span
            className={styles.title}
            style={
              title === 'Home' ? { color: '#eb5757', cursor: 'pointer' } : {}
            }
          >
            {title}
          </span>
        </div>
        {items && (
          <img
            src={dropdownSrc}
            className={styles.dropdown}
            alt=""
            onClick={() => setOpen(!open)}
            style={{ transform: `rotate(${open ? '0deg' : '90deg'})` }}
          ></img>
        )}
      </div>
      {items && open && (
        <div className={styles.items}>
          {items.map(item => (
            <p
              key={item}
              className={styles.item}
              onClick={() => {
                onClick(item)
              }}
            >
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default Category
