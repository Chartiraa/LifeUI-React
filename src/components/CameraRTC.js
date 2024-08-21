import React from 'react';

function VideoStream() {

  return (
    <div style={{ width: '100%', height: '80vh', border: 'none' }}>
      <iframe
        src="http://10.116.63.157:8080/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Site"
      />
    </div>
  );
}

export default VideoStream;
