import { useState } from "react";
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
