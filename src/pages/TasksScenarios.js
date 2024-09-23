import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Modal, Button as BootstrapButton, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from 'primereact/scrollpanel';
import { GoLocationTask, SprayTask, LaserTask } from "../components/taskSettings";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveScenario, fetchScenarios } from '../utils/taskFunctions'; // Firebase fonksiyonlarını içe aktarın

import Navbar from "../components/Navbar";
import MapComponent from "../components/Map";
import { getSortedTasks, addLocation, deleteScenario, updateScenario } from "../utils/taskFunctions";

import "../css/TasksScenarios.css";
import Swal from "sweetalert2";

export default function TasksScenarios() {
    const [refresh, setRefresh] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const [editScenario, setEditScenario] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [scenarioTasks, setScenarioTasks] = useState([]);
    const [scenarioName, setScenarioName] = useState(''); // Senaryo adı için state
    const [savedScenarios, setSavedScenarios] = useState([]); // Kayıtlı senaryolar için state
    const [loading, setLoading] = useState(true); // Yükleniyor durumu

    const isDisabled = !(scenarioTasks == "" || editScenario == true || selectedScenario == null);

    useEffect(() => {
        const fetchTasks = async () => {
            const sortedTasks = await getSortedTasks();
            setTasks(sortedTasks);
        };

        fetchTasks();
    }, [refresh]);

    useEffect(() => {
        const loadScenarios = async () => {
            try {
                setLoading(true);
                const scenarios = await fetchScenarios();
                setSavedScenarios(scenarios || []); // Eğer gelen veri yoksa boş bir dizi ayarlayın
            } catch (error) {
                console.error("Senaryolar yüklenirken hata oluştu:", error);
                setSavedScenarios([]); // Hata durumunda boş bir dizi ayarlayın
            } finally {
                setLoading(false);
            }
        };

        loadScenarios();
    }, [refresh]);

    useEffect(() => {
        console.log(scenarioTasks);
    }, [scenarioTasks]);

    const handleSaveScenario = () => {
        if (scenarioName && scenarioTasks.length > 0) {
            saveScenario(scenarioName, scenarioTasks)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Senaryo kaydedildi!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setRefresh(refresh + 1); // Yeniden senaryoları çekmek için refresh state'ini güncelleyin
                    setScenarioName(''); // Senaryo adını temizleyin
                    setScenarioTasks([]); // Senaryo görevlerini temizleyin
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'Senaryo kaydedilemedi!',
                    });
                });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı',
                text: 'Senaryo adı ve görevler boş olamaz!',
            });
        }
    };

    const handleShowModal = () => {
        setModalIsVisible(true);
    };

    const handleCloseModal = () => {
        setModalIsVisible(false);
    };

    const handleLocationSelect = (location) => {
        console.log("Seçilen Konum:", location);
        setSelectedLocation(location);
    };

    const handleSaveLocation = () => {
        if (selectedLocation && locationName) {
            addLocation(locationName, selectedLocation).then(() => {
                handleCloseModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Konum kaydedildi',
                    showConfirmButton: false,
                    timer: 1500
                });
                setRefresh(refresh + 1);
            });
        } else {
            alert("Lütfen bir konum seçin ve bir isim girin.");
        }
    };

    const addScenarioTask = (task) => {
        const uniqueTask = { ...task, uniqueId: `${task.taskID}-${scenarioTasks.length}` };
        setScenarioTasks([...scenarioTasks, uniqueTask]);
    };

    const removeScenarioTask = (uniqueId) => {
        setScenarioTasks(scenarioTasks.filter(task => task.uniqueId !== uniqueId));
    };

    const handleTaskClick = (task) => {
        setEditTask(task);
        setSelectedTask('Edit');
    };

    const handleButtonClick = (task, taskType = null) => {
        setEditTask(taskType === 'Edit' ? task : null);  // Düzenleme durumu için görevi ayarla
        setSelectedTask(taskType || task.taskType);      // Seçilen görev türünü ayarla
        setSelectedTaskId(task.taskID);                  // Seçilen görevin ID'sini ayarla
        console.log("Seçilen Görev:", task);
    };

    const renderSelectedTask = () => {
        switch (selectedTask) {
            case 'GoLocation':
                return <GoLocationTask onShowMapModal={handleShowModal} editTaskParams={""} refresh={refresh} setRefresh={setRefresh} addScenarioTask={addScenarioTask} />;
            case 'Spray':
                return <SprayTask editTaskParams={""} refresh={refresh} setRefresh={setRefresh} addScenarioTask={addScenarioTask} />;
            case 'Laser':
                return <LaserTask />;
            case 'Edit': // Düzenleme işlemi
                if (editTask) {
                    if (editTask.taskType === 'GoLocation') {
                        return <GoLocationTask editTaskParams={editTask} refresh={refresh} setRefresh={setRefresh} onShowMapModal={handleShowModal} addScenarioTask={addScenarioTask} disableForm={isDisabled} />;
                    } else if (editTask.taskType === 'Spray') {
                        return <SprayTask editTaskParams={editTask} refresh={refresh} setRefresh={setRefresh} />;
                    } else if (editTask.taskType === 'Laser') {
                        return <LaserTask editTaskParams={editTask} refresh={refresh} setRefresh={setRefresh} />;
                    }
                }
                return <LaserTask />;
            default:
                return (
                    <div className="tasksSettingsContainer">
                        <div>
                            <label className="label">BİR GÖREV SEÇİN</label>
                        </div>
                        <Button className="submitButton" icon="pi pi-arrow-right" iconPos="right" label={"Senaryoya Gönder"} />
                    </div>
                );
        }
    };

    const renderScenarioTasks = () => {
        return (
            <DragDropContext onDragEnd={isDisabled ? () => { } : handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {scenarioTasks && scenarioTasks.length > 0 ? (
                                scenarioTasks.map((task, index) => (
                                    <Draggable
                                        key={task.uniqueId || index} // Benzersiz ID veya index
                                        draggableId={task.uniqueId || `${index}`} // Draggable için benzersiz ID
                                        index={index}
                                        isDragDisabled={isDisabled} // Sürükleme devre dışı bırakıldı
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`card p-3 draggable-task ${snapshot.isDragging ? "dragging" : ""}`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                                    cursor: 'pointer' // Her zaman tıklama yapılabilir
                                                }}
                                                onClick={() => handleTaskClick(task)} // Tıklama her durumda çalışacak
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <i
                                                            className="bi bi-list fs-4"
                                                            style={{ cursor: isDisabled ? 'not-allowed' : 'grab', marginRight: '10px' }}
                                                            {...(isDisabled ? {} : provided.dragHandleProps)} // Sürükleme ikonu sadece enabled durumdaysa aktif
                                                        />
                                                        <label>{task.taskName}</label> {/* Görev adı */}
                                                    </div>
                                                    <div className="d-flex">
                                                        <i
                                                            className="bi bi-trash-fill fs-4"
                                                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Tıklamanın balonlanmasını önle
                                                                if (!isDisabled) {
                                                                    removeScenarioTask(task.uniqueId); // isDisabled değilse silme işlemi yapılır
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p>Görev bulunmamaktadır.</p>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    };

    const handleOnDragEnd = (result) => {
        if (isDisabled || !result.destination) return; // isDisabled true ise işlemi durdur
        const items = Array.from(scenarioTasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setScenarioTasks(items);
    };

    const handleNewScenario = () => {
        setEditScenario(null);
        setSelectedScenario(null);
        setScenarioTasks([]);
        setScenarioName('');
    };

    const handleDeleteScenario = async (scenarioId) => {
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu senaryoyu silmek istediğinizden emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, iptal et'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteScenario(scenarioId);
                    Swal.fire({
                        icon: 'success',
                        title: 'Senaryo silindi!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setRefresh(refresh + 1); // Silme işleminden sonra senaryoları yeniden yükleyin
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: 'Senaryo silinemedi!',
                    });
                }
            }
        });
    };

    const handleUpdateScenario = async () => {
        const newLastEditDate = new Date().toLocaleString(); // Yeni düzenleme tarihi
        const updatedTasks = scenarioTasks; // Düzenlenmiş görevler
        const scenarioId = selectedScenario?.id; // Senaryonun ID'sini alın (senaryonun key'i)

        if (scenarioId && typeof scenarioId === 'string') { // Senaryo ID'si geçerli mi kontrol et
            try {
                const newScenarioName = scenarioName !== selectedScenario.scenarioName ? scenarioName : null; // Eğer senaryo adı değişmişse
                await updateScenario(scenarioId, updatedTasks, newLastEditDate, newScenarioName); // Senaryoyu güncelle
                Swal.fire({
                    icon: 'success',
                    title: 'Senaryo başarıyla güncellendi!',
                    showConfirmButton: false,
                    timer: 1500
                });
                setRefresh(refresh + 1); // Güncellemeden sonra senaryoları yeniden yükle
            } catch (error) {
                console.error("Error updating scenario:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: 'Senaryo güncellenirken bir hata oluştu!',
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı',
                text: 'Senaryo adı eksik veya geçersiz!',
            });
        }
    };

    const handleSelectScenario = (scenario) => {
        setSelectedScenario(scenario);
        setScenarioName(scenario.scenarioName); // Senaryo adını doğru şekilde inputa ekle
        const tasks = scenario.tasks || []; // Görevleri al
        console.log(tasks);
        setScenarioTasks(tasks); // Görevleri senaryo görevlerine ata
        setEditScenario(false); // Düzenleme modunu aç
    };

    return (
        <div>
            <Navbar />
            <Row className="tasksScenariosContainer">
                <Col xl={2} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div className="tasksContainer">
                        <div className="defaultTasksContainer">
                            <label className="label">GÖREVLER</label>
                            <Button className={`button ${selectedTaskId === "GoLocation" ? "selected" : ""}`} onClick={() => handleButtonClick({ taskID: "GoLocation", taskType: "GoLocation" }, "GoLocation")} label={"Konuma Gitme"} />
                            <Button className={`button ${selectedTaskId === "Spray" ? "selected" : ""}`} onClick={() => handleButtonClick({ taskID: "Spray", taskType: "Spray" }, "Spray")} label={"İlaçlama"} />
                            <Button className={`button ${selectedTaskId === "Laser" ? "selected" : ""}`} onClick={() => handleButtonClick({ taskID: "Laser", taskType: "Laser" }, "Laser")} label={"Lazer"} />
                        </div>
                        <div className="registeredTasksContainer">
                            <label className="label">KAYITLI GÖREVLER</label>
                            <ScrollPanel style={{ width: "100%", height: "50vh" }}>
                                {tasks.map((task) => (
                                    <Button key={task.taskID} label={task.taskName} onClick={() => handleButtonClick(task, "Edit")} className={`button ${selectedTaskId === task.taskID ? "selected" : ""}`} />
                                ))}
                            </ScrollPanel>
                        </div>
                    </div>
                </Col>
                <Col xl={4}>
                    {renderSelectedTask()}
                </Col>
                <Col xl={3}>
                    <div className="scenarioSettingsContainer">
                        <div>
                            {selectedScenario == null ? <label className="label">SENARYO AYARLARI</label> :
                                <div className="headerContainer">
                                    <span className="icon icon-sm unvisible">
                                        <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                                    </span>
                                    <label className="headerLabel">SENARYO AYARLARI</label>
                                    <div className="tripledotContainer">
                                        <Dropdown as={ButtonGroup} className="tripledotDropdown">
                                            <Dropdown.Toggle as={Button} split variant="link" className="m-0 p-0 tripledot">
                                                <span className="icon icon-sm">
                                                    <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                                                </span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => setEditScenario(!editScenario)}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-2" /> Düzenle
                                                </Dropdown.Item>
                                                <Dropdown.Item className="text-danger">
                                                    <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Sil
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            }
                            <div className="inputGroup">
                                <label className="inputLabel">Senaryo Adı:</label>
                                <InputText value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} type="text" placeholder="Senaryo adını yazınız" disabled={isDisabled} />
                            </div>
                            {renderScenarioTasks()}
                        </div>
                        <Button className="submitButton" icon="pi pi-save" iconPos="right" label={selectedScenario == null & !isDisabled ? "Senaryoyu Kaydet" : "Düzenlemeyi Kaydet"} disabled={isDisabled} onClick={selectedScenario == null & !isDisabled ? handleSaveScenario : handleUpdateScenario} />
                    </div>
                </Col>
                <Col xl={3}>
                    <div className="scenarioContainer">
                        <label className="label">KAYITLI SENARYOLAR</label>
                        <Button icon="pi pi-plus" className="newScenarioButton" style={{ justifyContent: "center" }} label="Yeni Senaryo Ekle" onClick={handleNewScenario} />
                        {loading ? (
                            <p>Senaryolar yükleniyor...</p>
                        ) : savedScenarios && savedScenarios.length > 0 ? (
                            savedScenarios.map((scenario, index) => (
                                <div
                                    className={`card p-3`}
                                    key={index}
                                    style={{ width: '100%', borderRadius: '5px', border: '1px solid #8CA5C6', marginBottom: '10px' }}
                                    onClick={() => handleSelectScenario(scenario)} // Kart tıklanınca bilgileri getir
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5><strong>{scenario.scenarioName}</strong></h5> {/* Senaryo adı */}
                                            <div style={{ marginLeft: '10px', color: '#6c757d' }}>
                                                {/* Görevlerin Listesi */}
                                                {scenario.tasks && scenario.tasks.map((task, taskIndex) => (
                                                    <p key={taskIndex} className="mb-1" style={{ fontSize: '12px' }}>
                                                        {taskIndex + 1}. {task.taskName} {/* Görev adı */}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sil Butonu */}
                                        <div className="d-flex align-items-center" onClick={(e) => {
                                            e.stopPropagation(); // Kart tıklanmasını durdurur, yalnızca silme işlemi
                                            handleDeleteScenario(scenario.id);
                                        }}>
                                            <i className="bi bi-trash-fill" style={{ cursor: 'pointer', fontSize: '24px', color: '#dc3545' }}></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Kayıtlı senaryo bulunmamaktadır.</p>
                        )}

                    </div>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={modalIsVisible} onHide={handleCloseModal} centered dialogClassName="custom-modal-dialog">
                <Modal.Header closeButton>
                    <Modal.Title>Harita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapComponent style={{ height: "70vh", width: "100%" }} onLocationSelect={handleLocationSelect} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex align-items-center justify-content-between w-100">
                        {/* Seçilen koordinatları göster */}
                        <span>
                            <strong>Koordinatlar: </strong>
                            {selectedLocation ? `${selectedLocation.lat}, ${selectedLocation.lng}` : "Henüz bir konum seçilmedi"}
                        </span>

                        {/* Konum ismi girişi */}
                        <div className="d-flex align-items-center">
                            <label htmlFor="locationNameInput" style={{ marginRight: '10px' }}>Konum İsmi:</label>
                            <InputText id="locationNameInput" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Konum ismini yazınız" />
                        </div>
                        {/* Kapat ve Kaydet Butonları */}
                        <div>
                            <BootstrapButton variant="secondary" onClick={handleCloseModal}>Kapat</BootstrapButton>
                            <BootstrapButton variant="primary" onClick={handleSaveLocation} style={{ marginLeft: '10px' }}>Konumu Kaydet</BootstrapButton>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
