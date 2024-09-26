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

const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' - ');
    const [day, month, year] = datePart.split('-');
    return new Date(`${year}-${month}-${day}T${timePart}`);
};

export async function getLands() {
    const dbRef = ref(db);

    try {
        // TatekBOT/UI/Locations altındaki tüm verileri getir
        const snapshot = await get(child(dbRef, `TatekBOT/UI/Lands`));

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

export async function addLand(props) {
    const id = nanoid();
    const dbRef = ref(db, `TatekBOT/UI/Lands/${id}`);
    set(dbRef, {
        landID: id,
        landName: props.landName,
        offset: props.offset,
        siraArasi: props.siraArasi,
        siraUstu: props.siraUstu,
        bitkiTuru: props.bitkiTuru,
        coords: props.landCoords,
        lastEditDate: formatDate()
    })
        .catch((error) => {
            console.error("Konum kaydedilirken hata oluştu:", error);
        });
};

export const deleteLand = async (landID) => {
    const landRef = ref(db, `TatekBOT/UI/Lands/${landID}`);
    await remove(landRef);
};