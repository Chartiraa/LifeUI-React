import React from 'react';

function VideoStream() {

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        src="http://192.168.1.19:8080/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Site"
      />
    </div>
  );
}

export default VideoStream;
