import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroup, Dropdown } from '@themesberg/react-bootstrap';
import { Button } from "primereact/button";
import { Dropdown as PrimereactDropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Swal from 'sweetalert2'

import { addTask, getSortedTasks, getLocations, deleteTask, updateTask } from "../utils/taskFunctions";

export function GoLocationTask(props) {
    const { onShowMapModal, refresh, setRefresh, editTaskParams, addScenarioTask, disableForm } = props;

    const taskName = useRef(null);

    const [selectedMoveType, setSelectedMoveType] = useState('0');
    const [selectedArrivingLocation, setSelectedArrivingLocation] = useState('0');
    const [selectedArrivingMethod, setSelectedArrivingMethod] = useState('0');
    const [locations, setLocations] = useState([]); // Firebase'den gelen konumlar
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [saveButtonLabel, setSaveButtonLabel] = useState('Görevi Kaydet');
    const [tasks, setTasks] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Konumları Firebase'den çek ve state'e ata
        const fetchLocations = async () => {
            const fetchedLocations = await getLocations();
            setLocations(fetchedLocations.map(loc => ({ name: loc.locationName, value: loc }))); // Dropdown için uygun hale getir
        };

        fetchLocations(); // Sayfa yüklendiğinde konumları al

        const fetchTasks = async () => {
            const sortedTasks = await getSortedTasks(); // Görevleri sıralı olarak alın
            setTasks(sortedTasks); // State'e atayın
        };

        fetchTasks();
    }, [refresh]); // Sadece ilk yüklendiğinde çalışsın

    useEffect(() => {
        if (editTaskParams && typeof editTaskParams === "object") {
            // Konumlar geldikten sonra parametreleri ayarla
            const fetchLocationsAndSetParams = async () => {
                const fetchedLocations = await getLocations();
                setLocations(fetchedLocations.map(loc => ({ name: loc.locationName, value: loc })));

                // Diğer task parametrelerini ayarlayın
                taskName.current.value = editTaskParams.taskName || "";
                setSelectedLocation(fetchedLocations.find(loc => loc.locationName === editTaskParams.taskParams.location.locationName) || null);
                setSelectedMoveType(editTaskParams.taskParams.moveType === "Tek Yön" ? "0" : "1");
                setSelectedArrivingMethod(editTaskParams.taskParams.arrivingMethod === "En Kısa Yol" ? "0" : "1");
                setSelectedArrivingLocation("0");
            };

            fetchLocationsAndSetParams();
        } else {
            // Task parametreleri olmadıgı zaman varsayılan olarak null ata
            setSelectedLocation(null);
            setSelectedMoveType("0");
            setSelectedArrivingMethod("0");
            setSelectedArrivingLocation("0");

            taskName.current.value = "";
        }
    }, [editTaskParams]);

    useEffect(() => {
        if (editMode) {
            setSaveButtonLabel('Düzenlemeyi Kaydet');
        } else {
            setSaveButtonLabel('Görevi Kaydet');
        }
    }, [editMode]);

    const isDisabled = !(editTaskParams == "" || editMode == true); // Koşul

    const moveTypeChange = (e) => {
        setSelectedMoveType(e.currentTarget.value);
    };

    const arrivingLocationChange = (e) => {
        setSelectedArrivingLocation(e.currentTarget.value);
    };

    const arrivingMethodChange = (e) => {
        setSelectedArrivingMethod(e.currentTarget.value);
    };

    const handleNewLocation = () => {
        onShowMapModal();
    };

    const handleSave = () => {
        if (!taskName.current.value || !selectedLocation) {
            Swal.fire({
                title: "Eksik Bilgi",
                icon: "error",
                html: "Bilgileri eksiksiz doldurun!",
                confirmButtonText: "Tamam",
            });
        } else {
            addTask({
                taskType: 'GoLocation',
                taskName: taskName.current.value,
                taskParams: {
                    moveType: selectedMoveType == '0' ? 'Tek Yön' : 'Çift Yön',
                    arrivingMethod: selectedArrivingMethod == '0' ? 'En Kısa Yol' : 'Sıra Arası',
                    location: selectedLocation
                }
            })
                .then(() => {
                    let timerInterval;
                    Swal.fire({
                        title: "Görev Kaydı",
                        icon: "success",
                        html: "Görev kaydı başarıyla tamamlandı!",
                        timer: 2000,
                        timerProgressBar: true,
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    });
                    setRefresh(refresh + 1);
                })
                .catch((error) => {
                    console.error("Görev eklenirken hata oluştu:", error);  // Eğer bir hata varsa yakalayın
                });
        }
    };

    const handleUpdateTask = async () => {
        const updatedTask = {
            taskName: taskName.current.value, // Güncellenen görev adı
            taskParams: {
                moveType: selectedMoveType === '0' ? 'Tek Yön' : 'Çift Yön',
                arrivingMethod: selectedArrivingMethod === '0' ? 'En Kısa Yol' : 'Sıra Arası',
                location: selectedLocation
            }
        };

        try {
            // Görevi mevcut taskId ile güncelle
            await updateTask(editTaskParams.taskID, updatedTask);
            Swal.fire({
                icon: 'success',
                title: 'Görev başarıyla güncellendi!',
                showConfirmButton: false,
                timer: 1500
            });
            setRefresh(refresh + 1); // Güncellemeden sonra listeyi yenileyin
        } catch (error) {
            console.error("Error updating task:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Görev güncellenirken bir hata oluştu!',
            });
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Görevi Sil",
            icon: "warning",
            html: "Görevi silmek istediğinize emin misiniz?",
            showCancelButton: true,
            confirmButtonText: "Evet",
            cancelButtonText: "Hayır",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(editTaskParams);
                deleteTask(editTaskParams.taskID)
                    .then(() => {
                        let timerInterval;
                        Swal.fire({
                            title: "Görev Silindi",
                            icon: "success",
                            html: "Görev silindi!",
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        });
                        setRefresh(refresh + 1);
                    })
                    .catch((error) => {
                        console.error("Görev silinirken hata oluştu:", error);  // Eğer bir hata varsa yakalayın
                    });
            }
        });
    };

    const handleSubmit = () => {
        addScenarioTask(editTaskParams);
    };

    return (
        <div className="tasksSettingsContainer">
            <div>
                {editTaskParams == "" ? <label className="label">KONUMA GİTME AYARLARI</label> :
                    <div className="headerContainer">
                        <span className="icon icon-sm unvisible">
                            <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                        </span>
                        <label className="headerLabel">{editTaskParams == "" ? "KONUMA GİTME AYARLARI" : editTaskParams.taskName} AYARLARI</label>
                        <div className="tripledotContainer">
                            <Dropdown as={ButtonGroup} className="tripledotDropdown">
                                <Dropdown.Toggle as={Button} split variant="link" className="m-0 p-0 tripledot">
                                    <span className="icon icon-sm">
                                        <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setEditMode(!editMode)}>
                                        <FontAwesomeIcon icon={faEdit} className="me-2" /> Düzenle
                                    </Dropdown.Item>
                                    <Dropdown.Item className="text-danger" onClick={handleDelete}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Sil
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                }
                <div className="inputGroup">
                    <label className="inputLabel">Görev Adı:</label>
                    <InputText ref={taskName} type="text" placeholder="Görev adını yazınız" style={{ width: '65%' }} disabled={isDisabled} />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Görev Tipi:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Tek Yön" className={`switchButton ${selectedMoveType === '0' ? 'active' : ''}`} onClick={() => moveTypeChange({ currentTarget: { value: "0" } })} disabled={isDisabled} />
                        <Button label="Gidiş Dönüş" className={`switchButton ${selectedMoveType === '1' ? 'active' : ''}`} onClick={() => moveTypeChange({ currentTarget: { value: "1" } })} disabled={isDisabled} />
                    </ButtonGroup>
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Gidilecek Konum:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Kayıtlı Konum" className={`switchButton ${selectedArrivingLocation === '0' ? 'active' : ''}`} onClick={() => arrivingLocationChange({ currentTarget: { value: "0" } })} disabled={isDisabled} />
                        <Button label="Yeni Konum" className={`switchButton ${selectedArrivingLocation === '1' ? 'active' : ''}`} onClick={() => arrivingLocationChange({ currentTarget: { value: "1" } })} disabled={isDisabled} />
                    </ButtonGroup>
                </div>

                {selectedArrivingLocation == '0' ?
                    <div className="inputGroup">
                        <label className="inputLabel">Kayıtlı Konumlar:</label>
                        <div className="card flex justify-content-center" style={{ width: '65%' }}>
                            <PrimereactDropdown value={selectedLocation} onChange={(e) => setSelectedLocation(e.value)} options={locations} optionLabel="name"
                                placeholder="Gidilecek konumu seçiniz" className="dropdown" disabled={isDisabled} />
                        </div>
                    </div>

                    :
                    <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                        <Button onClick={handleNewLocation} className="openModalButton" icon="pi pi-arrow-right" iconPos="right" label={"Konum Ekle"} disabled={isDisabled} />
                    </div>
                }

                <div className="inputGroup">
                    <label className="inputLabel">Gidiş Türü:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="En Kısa Yol" className={`switchButton ${selectedArrivingMethod === '0' ? 'active' : ''}`} onClick={() => arrivingMethodChange({ currentTarget: { value: "0" } })} disabled={isDisabled} />
                        <Button label="Sıra Arası" className={`switchButton ${selectedArrivingMethod === '1' ? 'active' : ''}`} onClick={() => arrivingMethodChange({ currentTarget: { value: "1" } })} disabled={isDisabled} />
                    </ButtonGroup>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button onClick={editMode ? handleUpdateTask : handleSave} className="submitButton saveButton" icon="pi pi-save" iconPos="right" label={saveButtonLabel} disabled={isDisabled} />
                <Button onClick={handleSubmit} className="submitButton" icon="pi pi-arrow-right" iconPos="right" label="Senaryoya Gönder" disabled={disableForm} />
            </div>
        </div >
    );
}


export function SprayTask(props) {

    const { editTaskParams, refresh, setRefresh } = props;

    const taskName = useRef();
    const dosage = useRef();

    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedAppType, setSelectedAppType] = useState('0');
    const [selectedPlantType, setSelectedPlantType] = useState('0');
    const [submitButtonLabel, setSubmitButtonLabel] = useState('Senaryoya Gönder');
    const [submitButtonIcon, setSubmitButtonIcon] = useState('pi pi-arrow-right');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const sortedTasks = await getSortedTasks(); // Görevleri sıralı olarak alın
            setTasks(sortedTasks); // State'e atayın
        };

        fetchTasks();
    }, []);

    const plantTypes = [
        { name: 'Kültür', value: '0' },
        { name: 'Yabani', value: '1' }
    ];

    const plants = [
        { name: 'Patates' },
        { name: 'Mısır' },
        { name: 'Ayçiçeği' }
    ];

    const appTypes = [
        { name: 'Dozaj', value: '0' },
        { name: 'Yıkama', value: '1' }
    ];

    useEffect(() => {
        if (editTaskParams && typeof editTaskParams === "object") {  // Daha güçlü kontrol ekleyin
            taskName.current.value = editTaskParams.taskName || '';
            dosage.current.value = editTaskParams.taskParams.dosage || '';
            setSelectedPlant({ name: editTaskParams.taskParams.plant }); // Bitkiyi doğru ayarlayın
            setSelectedAppType(editTaskParams.taskParams.appType === 'Dozaj' ? '0' : '1');  // Uygulama türünü doğru eşleştirin
            setSelectedPlantType(editTaskParams.taskParams.plantType === 'Kültür' ? '0' : '1'); // Bitki türünü doğru eşleştirin
        } else {
            taskName.current.value = '';
            dosage.current.value = '';
            setSelectedPlant(null); // Bitkiyi doğru ayarlayın
            setSelectedAppType('0');  // Uygulama türünü doğru eşleştirin
            setSelectedPlantType('0'); // Bitki türünü doğru eşleştirin
            setSubmitButtonIcon('pi pi-arrow-right');
            setSubmitButtonLabel('Senaryoya Gönder');
        }
    }, [editTaskParams]);

    useEffect(() => {
        console.log(selectedPlant, selectedAppType, selectedPlantType);
    }, [selectedPlant, selectedAppType, selectedPlantType]);


    const plantTypeChange = (e) => {
        if (selectedPlantType == '0' && e.currentTarget.value == '1') {
            setSelectedPlantType('1');
        }
        else if (selectedPlantType == '1' && e.currentTarget.value == '0') {
            setSelectedPlantType('0');
        }
    };

    const appTypeChange = (e) => {
        if (selectedAppType == '0' && e.currentTarget.value == '1') {
            setSelectedAppType('1');
        }
        else if (selectedAppType == '1' && e.currentTarget.value == '0') {
            setSelectedAppType('0');
        }
    };

    const handleSubmit = () => {
        if (!taskName.current.value || !selectedPlant || !selectedAppType || !selectedPlantType) {
            Swal.fire({
                title: "Eksik Bilgi",
                icon: "error",
                html: "Bilgileri eksiksiz doldurun!",
                confirmButtonText: "Tamam",
            });
        } else {
            // tasks içindeki taskName'leri kontrol et
            const taskNames = tasks.map(task => task.taskName); // Tüm taskName'leri al
            if (taskNames.includes(taskName.current.value)) {  // Eğer yeni taskName mevcutsa
                Swal.fire({
                    title: "Görev Zaten Var",
                    icon: "warning",
                    html: "Bu isimde bir görev zaten mevcut. Düzenlemeye geçmek ister misiniz?",
                    confirmButtonText: "Düzenle",
                    showCancelButton: true,
                    cancelButtonText: "Vazgeç",
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Düzenleme moduna geçildi");
                        setSubmitButtonLabel("Görevi Düzenle");
                        setSubmitButtonIcon("pi pi-pencil");
                    } else {

                    }
                    // Mevcut görevi düzenleme moduna geç
                    /*const existingTask = tasks.find(task => task.taskName === taskName.current.value); // Eşleşen görevi bul
                    if (existingTask) {
                        setEditTask(existingTask); // Düzenlenecek görevi ayarla
                        setSelectedTask("Edit");  // Düzenleme moduna geç
                    }*/
                });
            } else {
                // Yeni görev ekle
                addTask({
                    taskType: 'Spray',
                    taskName: taskName.current.value,
                    taskParams: {
                        plant: selectedPlant.name,
                        appType: selectedAppType == '0' ? 'Dozaj' : 'Yıkama',
                        plantType: selectedPlantType == '0' ? 'Kültür' : 'Yabani',
                        dosage: dosage.current.value
                    }
                })
                    .then(() => {
                        let timerInterval;
                        Swal.fire({
                            title: "Görev Kaydı",
                            icon: "success",
                            html: "Görev kaydı başarıyla tamamlandı!",
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        });
                    })
                    .then(() => {
                        setRefresh(refresh + 1);
                    })
                    .catch((error) => {
                        console.error("Görev eklenirken hata oluştu:", error);  // Eğer bir hata varsa yakalayın
                    });
            }
        }
    };



    return (
        <div className="tasksSettingsContainer">
            <div>
                <label className="label">İLAÇLAMA AYARLARI</label>
                <div className="inputGroup">
                    <label className="inputLabel">Görev Adı:</label>
                    <InputText type="text" placeholder="Görev adını yazınız" ref={taskName} style={{ width: '65%' }} />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Hedef Bitki:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Kültür" className={`switchButton ${selectedPlantType === '0' ? 'active' : ''}`} onClick={() => plantTypeChange({ currentTarget: { value: "0" } })} />
                        <Button label="Yabani" className={`switchButton ${selectedPlantType === '1' ? 'active' : ''}`} onClick={() => plantTypeChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Bitki Türü:</label>
                    <div className="card flex justify-content-center" style={{ width: '65%' }}>
                        <PrimereactDropdown value={selectedPlant} onChange={(e) => setSelectedPlant(e.value)} options={plants} optionLabel="name"
                            placeholder="Bitki turü seçiniz" className="dropdown" />
                    </div>
                </div>

                <div className="inputGroup">
                    <label className="inputLabel">Uygulama Şekli:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Dozaj" className={`switchButton ${selectedAppType === '0' ? 'active' : ''}`} onClick={() => appTypeChange({ currentTarget: { value: "0" } })} />
                        <Button label="Yıkama" className={`switchButton ${selectedAppType === '1' ? 'active' : ''}`} onClick={() => appTypeChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>
                </div>

                {selectedAppType == '0' ?
                    <div className="inputGroup">
                        <label className="inputLabel">Dozaj:</label>
                        <div className="card flex justify-content-center" style={{ width: '65%' }}>
                            <InputText type="text" placeholder="Bitki başına ilaç miktarı" ref={dosage} />
                        </div>
                    </div>
                    : null}
            </div>
            <Button onClick={handleSubmit} className="submitButton" icon={submitButtonIcon} iconPos="right" label={submitButtonLabel} />
        </div>
    );
}

export function LaserTask(props) {

    const { onShowMapModal, refresh, setRefresh, editTaskParams } = props;

    const taskName = useRef(null);

    const [selectedMoveType, setSelectedMoveType] = useState('0');
    const [selectedArrivingLocation, setSelectedArrivingLocation] = useState('0');
    const [selectedArrivingMethod, setSelectedArrivingMethod] = useState('0');
    const [locations, setLocations] = useState([]); // Firebase'den gelen konumlar
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [submitButtonLabel, setSubmitButtonLabel] = useState('Senaryoya Gönder');
    const [submitButtonIcon, setSubmitButtonIcon] = useState('pi pi-arrow-right');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Konumları Firebase'den çek ve state'e ata
        const fetchLocations = async () => {
            const fetchedLocations = await getLocations();
            setLocations(fetchedLocations.map(loc => ({ name: loc.locationName, value: loc }))); // Dropdown için uygun hale getir
            console.log("Konumlar:", fetchedLocations);
        };

        fetchLocations(); // Sayfa yüklendiğinde konumları al

        const fetchTasks = async () => {
            const sortedTasks = await getSortedTasks(); // Görevleri sıralı olarak alın
            setTasks(sortedTasks); // State'e atayın
        };

        fetchTasks();
    }, [refresh]); // Sadece ilk yüklendiğinde çalışsın

    useEffect(() => {
        if (editTaskParams && typeof editTaskParams === "object") {
            // Konumlar geldikten sonra parametreleri ayarla
            const fetchLocationsAndSetParams = async () => {
                const fetchedLocations = await getLocations();
                setLocations(fetchedLocations.map(loc => ({ name: loc.locationName, value: loc })));

                // Diğer task parametrelerini ayarlayın
                taskName.current.value = editTaskParams.taskName || "";
                setSelectedLocation(fetchedLocations.find(loc => loc.locationName === editTaskParams.taskParams.location.locationName) || null);
                setSelectedMoveType(editTaskParams.taskParams.moveType === "Tek Yön" ? "0" : "1");
                setSelectedArrivingMethod(editTaskParams.taskParams.arrivingMethod === "En Kısa Yol" ? "0" : "1");
                setSelectedArrivingLocation("0");
            };

            fetchLocationsAndSetParams();
        } else {
            // Task parametreleri olmadıgı zaman varsayılan olarak null ata
            setSelectedLocation(null);
            setSelectedMoveType("0");
            setSelectedArrivingMethod("0");
            setSelectedArrivingLocation("0");

            taskName.current.value = "";
        }
    }, [editTaskParams]);


    const moveTypeChange = (e) => {
        if (selectedMoveType == '0' && e.currentTarget.value == '1') {
            setSelectedMoveType('1');
        }
        else if (selectedMoveType == '1' && e.currentTarget.value == '0') {
            setSelectedMoveType('0');
        }
    };

    const arrivingLocationChange = (e) => {
        if (selectedArrivingLocation == '0' && e.currentTarget.value == '1') {
            setSelectedArrivingLocation('1');
        }
        else if (selectedArrivingLocation == '1' && e.currentTarget.value == '0') {
            setSelectedArrivingLocation('0');
        }
    };

    const arrivingMethodChange = (e) => {
        if (selectedArrivingMethod == '0' && e.currentTarget.value == '1') {
            setSelectedArrivingMethod('1');
        }
        else if (selectedArrivingMethod == '1' && e.currentTarget.value == '0') {
            setSelectedArrivingMethod('0');
        }
    };

    const handleSubmit = () => {
        if (!taskName.current.value || !selectedLocation) {
            Swal.fire({
                title: "Eksik Bilgi",
                icon: "error",
                html: "Bilgileri eksiksiz doldurun!",
                confirmButtonText: "Tamam",
            });
        } else {
            // tasks içindeki taskName'leri kontrol et
            const taskNames = tasks.map(task => task.taskName); // Tüm taskName'leri al
            if (taskNames.includes(taskName.current.value)) {  // Eğer yeni taskName mevcutsa
                Swal.fire({
                    title: "Görev Zaten Var",
                    icon: "warning",
                    html: "Bu isimde bir görev zaten mevcut. Düzenlemeye geçmek ister misiniz?",
                    confirmButtonText: "Düzenle",
                    showCancelButton: true,
                    cancelButtonText: "Vazgeç",
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Düzenleme moduna geçildi");
                        setSubmitButtonLabel("Görevi Düzenle");
                        setSubmitButtonIcon("pi pi-pencil");
                    } else {

                    }
                    // Mevcut görevi düzenleme moduna geç
                    /*const existingTask = tasks.find(task => task.taskName === taskName.current.value); // Eşleşen görevi bul
                    if (existingTask) {
                        setEditTask(existingTask); // Düzenlenecek görevi ayarla
                        setSelectedTask("Edit");  // Düzenleme moduna geç
                    }*/
                });
            } else {
                // Yeni görev ekle
                addTask({
                    taskType: 'GoLocation',
                    taskName: taskName.current.value,
                    taskParams: {
                        moveType: selectedMoveType == '0' ? 'Tek Yön' : 'Çift Yön',
                        arrivingMethod: selectedArrivingMethod == '0' ? 'En Kısa Yol' : 'Sıra Arası',
                        location: selectedLocation
                    }
                })
                    .then(() => {
                        let timerInterval;
                        Swal.fire({
                            title: "Görev Kaydı",
                            icon: "success",
                            html: "Görev kaydı başarıyla tamamlandı!",
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        });
                    })
                    .then(() => {
                        setRefresh(refresh + 1);
                    })
                    .catch((error) => {
                        console.error("Görev eklenirken hata oluştu:", error);  // Eğer bir hata varsa yakalayın
                    });
            }
        }
    };

    const handleNewLocation = () => {
        onShowMapModal();
    }

    return (
        <div className="tasksSettingsContainer">
            <div>
                <label className="label">LAZER AYARLARI</label>
                <div className="inputGroup">
                    <label className="inputLabel">Görev Adı:</label>
                    <InputText ref={taskName} type="text" placeholder="Görev adını yazınız" style={{ width: '65%' }} />
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Görev Tipi:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Tek Yön" className={`switchButton ${selectedMoveType === '0' ? 'active' : ''}`} onClick={() => moveTypeChange({ currentTarget: { value: "0" } })} />
                        <Button label="Gidiş Dönüş" className={`switchButton ${selectedMoveType === '1' ? 'active' : ''}`} onClick={() => moveTypeChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>
                </div>
                <div className="inputGroup">
                    <label className="inputLabel">Gidilecek Konum:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="Kayıtlı Konum" className={`switchButton ${selectedArrivingLocation === '0' ? 'active' : ''}`} onClick={() => arrivingLocationChange({ currentTarget: { value: "0" } })} />
                        <Button label="Yeni Konum" className={`switchButton ${selectedArrivingLocation === '1' ? 'active' : ''}`} onClick={() => arrivingLocationChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>
                </div>

                {selectedArrivingLocation == '0' ?
                    <div className="inputGroup">
                        <label className="inputLabel">Kayıtlı Konumlar:</label>
                        <div className="card flex justify-content-center" style={{ width: '65%' }}>
                            <PrimereactDropdown value={selectedLocation} onChange={(e) => setSelectedLocation(e.value)} options={locations} optionLabel="name"
                                placeholder="Gidilecek konumu seçiniz" className="dropdown" />
                        </div>
                    </div>

                    :
                    <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                        <Button onClick={handleNewLocation} className="openModalButton" icon="pi pi-arrow-right" iconPos="right" label={"Konum Ekle"} />
                    </div>
                }

                <div className="inputGroup">
                    <label className="inputLabel">Gidiş Türü:</label>
                    <ButtonGroup className="buttonGroup">
                        <Button label="En Kısa Yol" className={`switchButton ${selectedArrivingMethod === '0' ? 'active' : ''}`} onClick={() => arrivingMethodChange({ currentTarget: { value: "0" } })} />
                        <Button label="Sıra Arası" className={`switchButton ${selectedArrivingMethod === '1' ? 'active' : ''}`} onClick={() => arrivingMethodChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>
                </div>
            </div>
            <div className="taskButtonGroup">
                <div style={{ display: "flex" }}>
                    <Button onClick={handleSubmit} className="deleteButton mx-3" icon="pi pi-trash" iconPos="right" label="Sil" />
                    <Button onClick={handleSubmit} className="editButton" icon="pi pi-pencil" iconPos="right" label="Düzenle" />
                </div>
                <Button onClick={handleSubmit} className="submitButton" icon={submitButtonIcon} iconPos="right" label={submitButtonLabel} />
            </div>

        </div>
    );
}