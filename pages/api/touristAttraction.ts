import { Firestore, collection, getDocs } from "firebase/firestore/lite";

export async function getTouristAttractions(firestore: Firestore) {
  const touristAttraction = collection(firestore, "touristAttraction");
  const touristAttractionSnapshot = await getDocs(touristAttraction);
  const toutistAttractionList = touristAttractionSnapshot.docs.map((doc) =>
    doc.data()
  );
  return toutistAttractionList;
}
