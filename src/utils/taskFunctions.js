import { getDatabase, ref, child, get, set, update, remove } from "firebase/database";
import { nanoid } from "nanoid";
import "../firebaseConfig";

const db = getDatabase();

function formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} - ${hours}:${minutes}`;
}

function formatDateOnly() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' - ');
    const [day, month, year] = datePart.split('-');
    return new Date(`${year}-${month}-${day}T${timePart}`);
};

export async function getSortedTasks() {
    try {
        // Veritabanındaki tüm görevleri referans edin
        const tasksRef = ref(db, 'TatekBOT/UI/Tasks');

        // Veritabanından veriyi alın
        const snapshot = await get(tasksRef);

        if (snapshot.exists()) {
            const tasks = snapshot.val(); // Görev verisini alın
            const tasksArray = Object.values(tasks); // Nesneyi bir diziye dönüştür

            // Tarihe göre sıralama işlemi (eskiden yeniye)
            tasksArray.sort((a, b) => {
                const dateA = parseDate(a.lastEditDate); // Düzeltilmiş tarih formatı
                const dateB = parseDate(b.lastEditDate); // Düzeltilmiş tarih formatı
                return dateA - dateB; // Eskiden yeniye sıralama
            });

            return tasksArray; // Sıralanmış görevleri döndür
        } else {
            console.log("Görev bulunamadı.");
            return []; // Boş bir dizi döndür
        }
    } catch (error) {
        console.error("Görevler alınırken hata oluştu:", error);
        return []; // Hata durumunda boş bir dizi döndür
    }
}

export async function addTask(props) {
    const id = nanoid();

    try {
        await set(ref(db, 'TatekBOT/UI/Tasks/' + id + '/'), {
            taskID: id,
            taskType: props.taskType,
            taskName: props.taskName,
            taskParams: props.taskParams,
            lastEditDate: formatDate()
        });
        console.log("Görev başarıyla eklendi!");
    } catch (error) {
        console.error("Firebase'e kayıt yapılırken hata oluştu:", error);
    }
}

export const updateTask = async (taskId, updatedTaskData) => {
    const db = getDatabase();

    // taskId'yi koruyarak ilgili referansı alıyoruz
    const taskRef = ref(db, `TatekBOT/UI/Tasks/${taskId}`);

    // Güncellenmiş verileri hazırlıyoruz
    const updatedData = {
        ...updatedTaskData, // Görev adı ve görev parametreleri gibi veriler
        lastEditDate: new Date().toLocaleString() // Düzenleme tarihi
    };

    try {
        // Mevcut taskId ile güncelleme yapıyoruz
        await update(taskRef, updatedData);
        console.log("Görev başarıyla güncellendi.");
    } catch (error) {
        console.error("Görev güncellenirken hata oluştu:", error);
        throw error; // Hata varsa fırlat
    }
};

export const deleteTask = async (taskID) => {
    const tasksRef = ref(db, `TatekBOT/UI/Tasks/${taskID}`);
    await remove(tasksRef);
};

export async function getLocations() {
    const dbRef = ref(db);

    try {
        // TatekBOT/UI/Locations altındaki tüm verileri getir
        const snapshot = await get(child(dbRef, `TatekBOT/UI/Locations`));

        if (snapshot.exists()) {
            const locations = [];
            snapshot.forEach((childSnapshot) => {
                // Her bir konumu al ve listeye ekle
                locations.push(childSnapshot.val());
            });

            // locations dizisini lastEditDate'e göre sıralama (yeniden eskiye)
            locations.sort((a, b) => {
                const dateA = parseDate(a.lastEditDate);
                const dateB = parseDate(b.lastEditDate);
                return dateA - dateB; // Yeniden eskiye sıralamak için
            });

            return locations;
        } else {
            console.log("Veri bulunamadı.");
            return [];
        }
    } catch (error) {
        console.error("Veri getirilirken hata oluştu:", error);
        return [];
    }
}

export async function addLocation(locationName, locationCoordinates) {
    const id = nanoid();
    const dbRef = ref(db, `TatekBOT/UI/Locations/${id}`);
    set(dbRef, {
        locationID: id,
        locationName: locationName,
        lat: locationCoordinates.lat,
        lng: locationCoordinates.lng,
        lastEditDate: formatDate()
    })
        .catch((error) => {
            console.error("Konum kaydedilirken hata oluştu:", error);
        });
};

export const fetchScenarios = async () => {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, `TatekBOT/UI/Scenarios`));
        if (snapshot.exists()) {
            const scenariosData = snapshot.val();
            // Firebase'den gelen veriyi bir dizi formatına dönüştürme
            return Object.keys(scenariosData).map(key => ({
                id: key, // Benzersiz senaryo ID'si
                ...scenariosData[key] // Senaryonun içeriği (scenarioName, lastEditDate, tasks)
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Senaryolar getirilirken hata oluştu:", error);
        return [];
    }
};

export const saveScenario = async (scenarioName, tasks) => {
    const db = getDatabase();
    const scenarioId = nanoid(); // Benzersiz bir ID oluştur

    const scenarioRef = ref(db, `TatekBOT/UI/Scenarios/${scenarioId}`);

    const scenarioData = {
        scenarioName: scenarioName, // Senaryo adı
        lastEditDate: new Date().toLocaleString(), // Düzenleme tarihi
        tasks: tasks // Görevler
    };

    try {
        await set(scenarioRef, scenarioData); // Yeni senaryoyu kaydet
        console.log("Senaryo başarıyla kaydedildi.");
    } catch (error) {
        console.error("Senaryo kaydedilemedi:", error);
    }
};

export const updateScenario = async (scenarioId, updatedTasks, newLastEditDate, newScenarioName = null) => {
    const db = getDatabase();
    const scenarioRef = ref(db, `TatekBOT/UI/Scenarios/${scenarioId}`);

    // Güncellenecek verileri hazırlayın
    const updatedData = {
        tasks: updatedTasks, // Görevler
        lastEditDate: newLastEditDate // Son düzenleme tarihi
    };

    if (newScenarioName) {
        updatedData.scenarioName = newScenarioName; // Senaryo adı değiştiyse ekleyin
    }

    try {
        await update(scenarioRef, updatedData);
        console.log("Senaryo başarıyla güncellendi.");
    } catch (error) {
        console.error("Senaryo güncellenirken hata oluştu:", error);
    }
};

export const deleteScenario = async (scenarioId) => {
    const scenarioRef = ref(db, `TatekBOT/UI/Scenarios/${scenarioId}`);
    await remove(scenarioRef);
};