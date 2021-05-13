import React from 'react'
import PropTypes from 'prop-types'

/**
 * Bootstrap notification wrapper
 * @param {array} notification - A STATE tuple where the first element is the notification text,
 * and the second is the alert color class, see https://getbootstrap.com/docs/4.4/components/alerts/
 * @param {function} setNotification - Function for setting the notification state
 */
const Notification = ({notification, setNotification}) => {
  if (notification.length === 2) {
    return (
      <div className={`alert ${notification[1]} alert-dismissible fade show`} role="alert">
        {notification[0]}
        <button onClick={() => setNotification([])} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  } else {
    return (<div></div>)
  }
}

Notification.propTypes = {
  notification: PropTypes.array,
  setNotification: PropTypes.func,
}

export default Notification
