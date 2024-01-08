import {useEffect, useState} from "react";
import { getFirestore, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";

import {
  BUILDINGS_LAYER,
  MUSEUMS_LAYER,
  NATURE_LAYER,
  RESTAURANTS_LAYER,
  SHOPPING_LAYER,
} from "../utils/constants";

export function useLayers() {

  const [nature, setNature] = useState(true);
  const [museums, setMuseums] = useState(true);
  const [shopping, setShopping] = useState(true);
  const [buildings, setBuildings] = useState(true);
  const [restaurants, setRestaurants] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const attractionPrefsRef = doc(db, 'users', userId, 'attractionPrefs', 'attractions');

        try {
          const docSnapshot = await getDoc(attractionPrefsRef);

          if (docSnapshot.exists()) {
            const preferencesData = docSnapshot.data();

            setNature(preferencesData.nature);
            setMuseums(preferencesData.museums);
            setShopping(preferencesData.shopping);
            setBuildings(preferencesData.buildings);
            setRestaurants(preferencesData.restaurants);

            console.log('Preferinte actractii existente:', preferencesData);
          } else {
            console.log('Nicio preferinta actratie gasita pentru utilizatorul curent.');
          }
        } catch (error) {
          console.error('Eroare la verificare preferinte atractii:', error);
        }
      }
    };
    fetchData();
  }, []);
  
  function toggleLayer(layerName: string) {
    switch (layerName) {
      case NATURE_LAYER:
        setNature((current) => !current);
        break;
      case MUSEUMS_LAYER:
        setMuseums((current) => !current);
        break;
      case SHOPPING_LAYER:
        setShopping((current) => !current);
        break;
      case BUILDINGS_LAYER:
        setBuildings((current) => !current);
        break;
      case RESTAURANTS_LAYER:
        setRestaurants((current) => !current);
        break;
    }
  }
  return { nature, museums, shopping, buildings, restaurants, toggleLayer };
}
