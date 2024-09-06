import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import Navbar from "../components/Navbar";
import CompassComponent from "../components/CompassComp";
import WindDirection from "../components/Wind";
import Driving from "../components/Driving";
import Map from "../components/Map";
import VideoStream from "../components/CameraRTC";
import kamera1 from "../assets/img/Kamera 1.webp";
import LineChart from "../components/Graphs";

import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export default () => {

  const navbarRef = useRef(null);  // Navbar referansı oluşturuluyor

  const [rowHeight, setRowHeight] = useState(100);  // Varsayılan bir değer

  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'comp1', x: 0, y: 1, w: 5, h: 3, minW: 2, maxW: 5, minH: 2, maxH: 4 },
      { i: 'comp7', x: 0, y: 4, w: 5, h: 3, minW: 2, maxW: 5, minH: 2, maxH: 4 },
      { i: 'comp2', x: 5, y: 3, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2 },
      { i: 'comp3', x: 5, y: 1, w: 4, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp6', x: 5, y: 5, w: 4, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp4', x: 7, y: 3, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2 },
      { i: 'comp5', x: 9, y: 1, w: 3, h: 6, minW: 3, maxW: 3, minH: 6, maxH: 6 },
      // Daha fazla komponent ekleyebilirsiniz...
    ],
    md: [
      { i: 'comp1', x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 5, minH: 2, maxH: 4 },
      { i: 'comp2', x: 3, y: 0, w: 3, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp3', x: 0, y: 2, w: 6, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp4', x: 0, y: 4, w: 6, h: 2, minW: 4, maxW: 12, minH: 2, maxH: 6 },
    ],
    sm: [
      { i: 'comp1', x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 5, minH: 2, maxH: 4 },
      { i: 'comp2', x: 2, y: 0, w: 2, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp3', x: 0, y: 2, w: 4, h: 2, minW: 2, maxW: 3, minH: 2, maxH: 3 },
      { i: 'comp4', x: 0, y: 4, w: 4, h: 2, minW: 4, maxW: 12, minH: 2, maxH: 6 },
    ],
  });

  useEffect(() => {
    console.log(window.innerHeight);
    // Navbar yüksekliğini hesaplayarak rowHeight'ı ayarlama
    const calculateRowHeight = () => {
      const navbarHeight = 83
      const availableHeight = window.innerHeight - navbarHeight;  // Kullanılabilir yükseklik
      const rowCount = 6;  // Satır sayısı

      // Satır yüksekliğini, kalan alanı 6'ya bölerek hesapla
      const newRowHeight = availableHeight / rowCount;
      setRowHeight(newRowHeight);  // Dinamik rowHeight hesaplama
    };

    // Yüksekliği hesapla ve pencere boyutu değiştiğinde yeniden hesapla
    calculateRowHeight();
    window.addEventListener('resize', calculateRowHeight);

    return () => window.removeEventListener('resize', calculateRowHeight);  // Cleanup on unmount
  }, []);

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const handleResizeStop = (layout) => validateLayout(layout);

  const validateLayout = (newLayout) => {
    const totalRows = newLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);

    if (totalRows > 6) {
      alert("Düzenleme sınırı aşıyor. Toplamda 6 satırdan fazla olamaz.");
      setLayouts(prevLayouts => ({ ...prevLayouts }));
    } else {
      setLayouts(prevLayouts => {
        if (JSON.stringify(prevLayouts.lg) !== JSON.stringify(newLayout)) {
          return { ...prevLayouts, lg: newLayout };
        }
        return prevLayouts;
      });
    }
  };

  return (
    <>
      <div ref={navbarRef}>
        <Navbar />

      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 8, sm: 6 }}
        rowHeight={(window.innerHeight - 83 - 100) / 6} // Satır yüksekliği tam sayı olmalı
        isResizable={true}
        isDraggable={true}
        draggableHandle=".drag-handle"
        maxRows={6}  // Maksimum satır sayısı
        onResizeStop={handleResizeStop}  // Yeniden boyutlandırma bittiğinde kontrol
      >
        <div key="comp1" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10, color: 'white' }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <img style={{ height: "100%", width: "100%", borderRadius: "5px" }} src={kamera1} />
        </div>

        <div key="comp2" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <CompassComponent />
        </div>

        <div key="comp3" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <LineChart />
        </div>

        <div key="comp6" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <LineChart />
        </div>

        <div key="comp4" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <WindDirection />
        </div>

        <div key="comp5" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <Driving />
        </div>

        <div key="comp7" className="component-box">
          <div className="drag-handle" style={{ position: 'absolute', top: 10, right: 15, cursor: 'move', zIndex: 10 }}>
            <i className="bi bi-arrows-move"></i>
          </div>
          <Map style={{ height: "100%", width: "100%" }} />
        </div>

      </ResponsiveGridLayout>
    </>
  );
};
