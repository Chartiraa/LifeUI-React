import React, { useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

import { addLand } from '../utils/landFunctions';


const LandCard = (props) => {
    return (
        <div
            className={`card p-3`}
            style={{
                width: '100%',
                borderRadius: '5px',
                border: props.isSelected ? '3px solid #8CA5C6' : '1px solid #8CA5C6',
                marginBottom: '10px',
                cursor: 'pointer'
            }}
            onClick={props.onClick}
        >
            <div className="d-flex align-items-center justify-content-between">
                <div className="me-3 ms-3">
                    <h5>{props.title}</h5>
                    <p className="mb-1"><strong>Bitki Türü:</strong> {props.bitkiTuru}</p>
                    <p className="mb-1"><strong>Arazi Boyutu:</strong> {props.araziBoyutu}</p>
                    <p className="mb-1"><strong>Sıra Arası:</strong> {props.siraArasi}</p>
                    <p className="mb-1"><strong>Sıra Üstü:</strong> {props.siraUstu}</p>
                </div>
                <div className='d-flex align-items-center justify-content-end'>
                    <div className="vr me-3" style={{ minHeight: '100%' }}></div>
                    <div className="d-flex flex-column">
                        <i className="bi bi-pencil-square fs-4" style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => props.onClickEdit()} ></i>
                        <i className="bi bi-trash-fill fs-4" style={{ cursor: 'pointer' }} onClick={() => props.onClickDelete()}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandRegister = (props) => {

    const { coords, setCoords } = props;

    const [selectedPlant, setSelectedPlant] = useState(null);

    const plants = [
        { name: 'Patates' },
        { name: 'Mısır' },
        { name: 'Ayçiçeği' }
    ];

    const landName = useRef();
    const offset = useRef();
    const siraArasi = useRef();
    const siraUstu = useRef();

    const handleAdd = () => {
        if (!landName.current.value || !offset.current.value || !siraArasi.current.value || !siraUstu.current.value) {
            alert("Alanları eksiksiz doldurun!");
            return;
        } else if (isNaN(offset.current.value) || isNaN(siraArasi.current.value) || isNaN(siraUstu.current.value)) {
            alert("Arazi boyutları sayısal bir değer olmalıdır!");
            return;
        } else if (offset.current.value < 0 || siraArasi.current.value < 0 || siraUstu.current.value < 0) {
            alert("Arazi boyutları negatif sayı olamaz!");
            return;
        } else if (offset.current.value > 1000 || siraArasi.current.value > 1000 || siraUstu.current.value > 1000) {
            alert("Arazi boyutları 1000'den büyük sayı olamaz!");
            return;
        } else {
            addLand({
                landName: landName.current.value,
                offset: offset.current.value,
                siraArasi: siraArasi.current.value,
                siraUstu: siraUstu.current.value,
                bitkiTuru: selectedPlant.name,
                landCoords: coords
            })
                .then(() => {
                    alert("Arazi eklendi!");
                })

        }

    };

    return (
        <div className="card shadow-sm w-100" style={{ borderRadius: '5px', border: '1px solid #e0e0e0', margin: 'auto' }}>
            <div className="card-body">
                <form>
                    <div className=" mb-3">
                        <label className=" col-form-label">Arazi Adı:</label>
                        <input ref={landName} type="text" className="form-control" />
                    </div>
                    <div className="row mb-3">
                        <label className="col-form-label">Offset (cm):</label>
                        <div className="">
                            <input ref={offset} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-form-label">Sıra Arası (cm):</label>
                        <div className="">
                            <input ref={siraArasi} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-form-label">Sıra Üstü (cm):</label>
                        <div className="">
                            <input ref={siraUstu} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-form-label">Bitki Türü:</label>
                        <div className="">
                            <Dropdown value={selectedPlant} onChange={(e) => setSelectedPlant(e.value)} options={plants} optionLabel="name"
                                placeholder="Bitki türü" className="dropdown" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="button" onClick={handleAdd} className="btn btn-dark" style={{ borderRadius: '5px', width: '100%' }}>Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LandEditor = (props) => {
    return (
        <div className="card p-4 shadow-sm w-100" style={{ borderRadius: '5px', border: '1px solid #e0e0e0', margin: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', padding: '10px' }}>
                <h5 className="mb-0">Arazi Bilgileri Düzenle</h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Koordinatlar:</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" placeholder="X" />
                        </div>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" placeholder="Y" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label"></label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" placeholder="Z" />
                        </div>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" placeholder="W" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Offset (cm):</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Sıra Arası (cm):</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" value={'70'} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Sıra Üstü (cm):</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" value={'15'} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Bitki Türü:</label>
                        <div className="col-sm-8">
                            <select className="form-select">
                                <option value="">dsfdghfgd</option>
                                <option value="1">Mısır</option>
                                <option value="2">Ayçiçeği</option>
                                <option value="2">Patates</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-dark ms-2">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export { LandCard, LandRegister, LandEditor };
