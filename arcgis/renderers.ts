export const restaurantsRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "web-style", // autocasts as new WebStyleSymbol()
    name: "restaurant",
    portal: {
      url: "https://www.arcgis.com",
    },
    styleName: "Esri2DPointSymbolsStyle",
  },
};

export const muzeumsRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "web-style", // autocasts as new WebStyleSymbol()
    name: "museum",
    portal: {
      url: "https://www.arcgis.com",
    },
    styleName: "Esri2DPointSymbolsStyle",
  },
};

export const natureRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "web-style", // autocasts as new WebStyleSymbol()
    name: "park",
    portal: {
      url: "https://www.arcgis.com",
    },
    styleName: "Esri2DPointSymbolsStyle",
  },
};

export const countyRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-line",
    name: "county",
  },
};

export const shoppingRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "web-style", // autocasts as new WebStyleSymbol()
    name: "shopping-center",
    portal: {
      url: "https://www.arcgis.com",
    },
    styleName: "Esri2DPointSymbolsStyle",
  },
};

export const buildingRenderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "web-style", // autocasts as new WebStyleSymbol()
    name: "house",
    portal: {
      url: "https://www.arcgis.com",
    },
    styleName: "Esri2DPointSymbolsStyle",
  },
};
