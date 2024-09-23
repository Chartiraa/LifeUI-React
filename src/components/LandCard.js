import React from 'react';

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
                </div>
                <div className="vr" style={{ minHeight: '100%' }}></div>
                <div className="ms-1">
                    <p className="mb-1"><strong>Bitki Türü:</strong> {props.bitkiTuru}</p>
                    <p className="mb-1"><strong>Arazi Boyutu:</strong> {props.araziBoyutu}</p>
                    <p className="mb-1"><strong>Sıra Arası:</strong> {props.siraArasi}</p>
                    <p className="mb-1"><strong>Sıra Üstü:</strong> {props.siraUstu}</p>
                </div>
                <div className="vr ms-3" style={{ minHeight: '100%' }}></div>
                <div className="d-flex flex-column">
                    <i className="bi bi-pencil-square fs-4" style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => props.onClickEdit()} ></i>
                    <i className="bi bi-trash-fill fs-4" style={{ cursor: 'pointer' }}></i>
                </div>
            </div>
        </div>
    );
};
const LandRegister = () => {
    return (
        <div className="card p-4 shadow-sm w-100" style={{ borderRadius: '5px', border: '1px solid #e0e0e0', margin: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', padding: '10px' }}>
                <h5 className="mb-0">Yeni Arazi Kaydı</h5>
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
                                <option value="">Seçiniz</option>
                                <option value="1">Mısır</option>
                                <option value="2">Ayçiçeği</option>
                                <option value="2">Patates</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-dark ms-2" style={{ borderRadius: '5px' }}>Kaydet</button>
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
