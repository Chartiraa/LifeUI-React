import React, { useState, useEffect } from "react";
import { Col, Row, ButtonGroup } from '@themesberg/react-bootstrap';
import { Button } from "primereact/button";
import Navbar from "../components/Navbar";
import MapComponent from "../components/Map";
import { LandCard, LandRegister } from "../components/LandCard";
import { getLands, deleteLand } from "../utils/landFunctions";
import Swal from "sweetalert2";

// Alanı dönüm cinsinden hesaplayan fonksiyonu buraya ekliyoruz
const calculateAreaInDonum = (coords) => {
    const R = 6371; // Dünya'nın yarıçapı (km)

    const toRadians = (degree) => (degree * Math.PI) / 180;

    let totalArea = 0;

    if (coords.length < 3) return 0; // Alan hesaplanamıyorsa 0 döndür

    const points = [...coords];
    if (points[0] !== points[points.length - 1]) {
        points.push(points[0]); // Çokgeni kapatmak için ilk noktayı sona ekle
    }

    for (let i = 0; i < points.length - 1; i++) {
        const lat1 = toRadians(points[i].lat);
        const lon1 = toRadians(points[i].lng);
        const lat2 = toRadians(points[i + 1].lat);
        const lon2 = toRadians(points[i + 1].lng);

        totalArea += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    totalArea = (totalArea * R * R) / 2; // km² cinsinden alan

    const areaInSquareMeters = totalArea * 1_000_000; // km² -> m² çevir
    const areaInDonum = areaInSquareMeters / 1_000; // m² -> dönüm çevir

    return Math.abs(areaInDonum); // Dönüm cinsinden alanı döndür
};

export default () => {
    const [registerState, setRegisterState] = useState("0");
    const [coords, setCoords] = useState([]); // Seçilen arazinin koordinatlarını tutan state
    const [selectedCard, setSelectedCard] = useState(null); // Seçilen kartı null yapalım
    const [lands, setLands] = useState([]); // getLands'den gelecek verileri tutacak state
    const [isEditable, setIsEditable] = useState(false);
    const [refresh, setRefresh] = useState(0); // Sayfanın yenilenmesini sağlamak için

    useEffect(() => {
        const fetchLands = async () => {
            const fetchedLands = await getLands(); // getLands fonksiyonu Firebase'den veriyi çekiyor
            setLands(fetchedLands); // Veriyi state'e kaydet
        };

        fetchLands();
    }, [refresh]); // refresh state'i değiştiğinde verileri yeniden çek

    const handleCardClick = (land) => {
        setSelectedCard(land.landID); // Seçilen kartı ayarla
        setCoords(land.coords || []); // Seçilen kartın koordinatlarını ayarla, yoksa boş dizi
    };

    const handleCardDelete = (landID) => {
        Swal.fire({
            title: 'Emin misiniz?',
            text: 'Gerçekten bu araziyi silmek istiyor musunuz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Vazgeç',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteLand(landID).then(() => {
                    Swal.fire('Arazi silindi!', '', 'success');
                    setRefresh((prev) => prev + 1); // Sayfayı yenilemek için refresh state'i arttır
                });
                setCoords([]); // Koordinatları sıfırla
            }
        });
    };

    const handleChange = (e) => {
        if (registerState === '0' && e.currentTarget.value === '1') {
            setRegisterState('1');
            setCoords([]); // Yeni arazi kaydı için koordinatları sıfırla
        } else if (registerState === '1' && e.currentTarget.value === '0') {
            setRegisterState('0');
            setCoords([]);
        }
    };

    const handleLocationSelect = (location) => {
        console.log("Seçilen konum:", location);
    };

    return (
        <>
            <Navbar />
            <Row>
                <Col xl={3}>
                    <ButtonGroup style={{ marginTop: '20px', minWidth: '100%', marginBottom: '20px' }}>
                        <Button label="Kayıtlı Araziler" className={`land-button w-100 ${registerState === '0' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "0" } })} />
                        <Button label="Yeni Arazi Kaydı" className={`land-button w-100 ${registerState === '1' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>

                    {registerState === '0' ? (
                        lands.map((land) => {
                            const areaInDonum = land.coords && land.coords.length >= 3 ? calculateAreaInDonum(land.coords) : "Veri yok";

                            return (
                                <LandCard
                                    key={land.landID}
                                    title={land.landName}
                                    bitkiTuru={land.bitkiTuru || "Belirtilmemiş"}
                                    araziBoyutu={typeof areaInDonum === 'number' ? `${areaInDonum.toFixed(2)} dönüm` : areaInDonum}
                                    siraArasi={land.siraArasi}
                                    siraUstu={land.siraUstu}
                                    isSelected={selectedCard === land.landID}
                                    onClick={() => handleCardClick(land)}
                                    onClickEdit={() => console.log("Arazi düzenleniyor:", land.landID)}
                                    onClickDelete={() => handleCardDelete(land.landID)}
                                />
                            );
                        })
                    ) : (
                        <LandRegister coords={coords} setCoords={setCoords} />
                    )}
                </Col>
                <Col xl={9}>
                    {registerState === '0' ? (
                        <MapComponent
                            key={0}
                            style={{ height: "90vh", width: "100%", borderRadius: "5px" }}
                            showPolygon={true} // Koordinatlar varsa çokgeni göster
                            editable={isEditable}
                            onLocationSelect={handleLocationSelect}
                            coords={coords} // Koordinatları MapComponent'e gönder
                            setCoords={setCoords} // Sıfırdan çizmek için setCoords
                        />
                    ) :
                        (<MapComponent
                            key={1}
                            style={{ height: "90vh", width: "100%", borderRadius: "5px" }}
                            showPolygon={true} // Koordinatlar varsa çokgeni göster
                            editable={!isEditable}
                            onLocationSelect={handleLocationSelect}
                            coords={[]} // Koordinatları MapComponent'e gönder
                            setCoords={setCoords} // Sıfırdan çizmek için setCoords
                        />)
                    }

                </Col>
            </Row>
        </>
    );
};
