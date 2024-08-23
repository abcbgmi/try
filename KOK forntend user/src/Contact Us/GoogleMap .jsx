import React from 'react';
import "./GoogleMap.css"

const GoogleMap = () => {
  return (
    <>
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2300095.3630165667!2d72.31082991617127!3d18.770459213229422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f75e005ee1f%3A0xe18ab41f7f3c5f5d!2sSumeru%20City%20Mall!5e0!3m2!1sen!2sin!4v1716265510953!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
};

export default GoogleMap;
