import React, { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";
import EmptyPage from '../../pages/profile_page';

import {
  buildingRenderer,
  muzeumsRenderer,
  natureRenderer,
  restaurantsRenderer,
  shoppingRenderer,
  countyRenderer,
} from "../../arcgis/renderers";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { useLayers } from "../../hooks/map";
import {
  NATURE_LAYER,
  NATURE_LAYER_LABEL,
  layersInfo,
} from "../../utils/constants";
import { SocketAddress } from "net";
import { padding } from "@mui/system";

const LayerToogles = ({
  nature,
  museums,
  shopping,
  buildings,
  restaurants,
  toggleLayer,
  setAttractionList,
}: {
  nature: boolean;
  museums: boolean;
  shopping: boolean;
  buildings: boolean;
  restaurants: boolean;
  toggleLayer: (layerName: string) => void;
  setAttractionList: Function;
}) => {
  let index = 0;
  const bools = [nature, museums, shopping, buildings, restaurants];
  return (
    <Stack direction="row" marginTop={"1rem"}>
      {layersInfo.map(({ layerName, layerLabel }) => (
        <>
          <FormLabel>{layerLabel}</FormLabel>
          <Switch
            colorScheme="teal"
            size="md"
            isChecked={bools[index++]}
            onChange={() => {
              toggleLayer(layerName);
              setAttractionList([]);
            }}
          />
        </>
      ))}
    </Stack>
  );
};

const AttractionDiv = () => {};

let point = false;

function Map() {
  let view: any;
  const MapElement = useRef(null);
  const [pointIndex, setPointIndex] = useState(0);
  const [mapPoint, setMapPoint] = useState<any>(null);
  const [attractionsList, setAttractionList] = useState([]);
  const [activate, setActivate] = useState(false)

  const { nature, museums, shopping, buildings, restaurants, toggleLayer } =
    useLayers();

  useEffect(() => {
    const setMap = async () => {
      const [
        MapView,
        Map,
        esriConfig,
        FeatureLayer,
        Search,
        Graphic,
        route,
        RouteParameters,
        FeatureSet,
        PopupTemplate,
        Legend,
      ] = await loadModules(
        [
          "esri/views/MapView",
          "esri/Map",
          "esri/config",
          "esri/layers/FeatureLayer",
          "esri/widgets/Search",
          "esri/Graphic",
          "esri/rest/route",
          "esri/rest/support/RouteParameters",
          "esri/rest/support/FeatureSet",
          "esri/PopupTemplate",
          "esri/widgets/Legend",
        ],
        { css: true }
      );

      esriConfig.apiKey = "AAPK082c5d1531b4485d805759f4a12464aaUErOxtUbhCpQYXT6hUqgsB93IDNdPCs-ixE7KigFyDM91mi2wKodZSkcvp7hh111"
      const map = new Map({
        basemap: "streets-vector",
        portalItem: { id: "d7e8cd6ae3854af6b2ed3a34609b8165" },
      });
      let mapPointt: any;
      view = new MapView({
        map: map,
        // use the ref as a container
        container: MapElement.current,
        zoom: 6,
        center: [25, 46],
      });

      const search = new Search({
        view: view,
      });
      view.ui.add(search, "top-right");

      const routeUrl =
        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

      view.on("click", function (event: { mapPoint: any }) {
        mapPointt = event.mapPoint;
        console.log(mapPointt);
      });

      function addGraphic(type: string, point: any) {
        const graphic = new Graphic({
          symbol: {
            type: "simple-marker",
            color: type === "origin" ? "white" : "black",
            size: "8px",
          },
          geometry: point,
        });
        view.graphics.add(graphic);
      }

      function createMovingPoint() {
        const symbol = {
          type: "picture-marker",
          url: "data:image/png;base64,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",
          width: "50px",
          height: "50px"
        };

        const movingPoint = new Graphic({
          geometry: null,
          symbol: symbol,
        });

        return movingPoint;
      }

      function moveAlongRoute(routeGeometry: { paths: any; spatialReference: any; }, movingPoint: { geometry: { type: string; x: any; y: any; spatialReference: any; }; }, view: { graphics: { add: (arg0: any) => void; remove: (arg0: any) => void; }; }) {
        const lineSymbol = {
          type: "simple-line",
          color: [5, 150, 255],
          width: 3,
        };
      
        const routeGraphic = new Graphic({
          geometry: routeGeometry,
          symbol: lineSymbol,
        });
      
        view.graphics.add(routeGraphic);
      
        let pathIndex = 0;
        let pointIndex = 0;
        const routeCoordinates = routeGeometry.paths;
      
        function animateAlongRoute() {
          if (pathIndex < routeCoordinates.length) {
            const currentPath = routeCoordinates[pathIndex];
      
            if (pointIndex === 0 && pathIndex === 0) {
              const startPoint = {
                type: "point",
                x: currentPath[0][0],
                y: currentPath[0][1],
                spatialReference: routeGeometry.spatialReference,
              };
              movingPoint.geometry = startPoint;
              view.graphics.add(movingPoint);
            }
      
            const [x, y] = currentPath[pointIndex];
            const pathPoint = {
              type: "point",
              x: x,
              y: y,
              spatialReference: routeGeometry.spatialReference,
            };
      
            movingPoint.geometry = pathPoint;
      
            pointIndex++;
      
            if (pointIndex === currentPath.length) {
              pointIndex = 0;
              pathIndex++;
            }
      
            setTimeout(animateAlongRoute, 100);
          } else {
            view.graphics.remove(movingPoint);
          }
        }
      
        animateAlongRoute();
        setActivate(false);
      }
      

      function getRoute() {
        console.log('point = ', point);
        if (point) {
        let features = view.graphics.toArray().filter((feature: any) => feature.geometry.x);
        const routeParams = new RouteParameters({
          stops: new FeatureSet({ features: features }),
          returnDirections: false,
        });

        route
          .solve(routeUrl, routeParams)
          .then(function (data: { routeResults: any[] }) {
            data.routeResults.forEach(function (result: { route: any }) {
              const routeGeometry = result.route.geometry;
              const movingPoint = createMovingPoint();
                moveAlongRoute(routeGeometry, movingPoint, view);
            });
          })
          .catch(function (error: any) {
            console.log(error);
          });
        }
      }

      const measureThisAction = {
        title: "Add attraction",
        content: "{FORMATTED_ADDRESS} <br /> Rating: {RATING}",
        id: "add",
      };

      const popupTemplate = new PopupTemplate({
        title: "{NAME}",
        content: "{FORMATTED_ADDRESS} <br /> Rating: {RATING}",
        actions: [measureThisAction],
      });

      const popupTemplateCounty = new PopupTemplate({
        title: "{nume}",
        content: "{nume}",
      });

      async function test() {
        if (view.graphics.length === 0) {
          addGraphic("origin", mapPointt);
        } else {
          addGraphic(`Point${pointIndex}`, mapPointt);
          setPointIndex((prev) => prev + 1);
          getRoute();
        }
      }

      view.popup.on("trigger-action", (event: any) => {
        console.log(view.popup.content.title);
        if (event.action.id === "add") {
          const title = view.popup.title;
          const address = view.popup.content.viewModel.content.substring(
            0,
            view.popup.content.viewModel.content.indexOf("<")
          );
          const rating = view.popup.content.viewModel.content.substring(
            view.popup.content.viewModel.content.indexOf(">") + 1,
            view.popup.content.viewModel.content.length
          );
      
          setAttractionList((oldarr) => {
            const newAttraction = { title: title, address: address, rating: rating };
            const updatedList = [...oldarr, newAttraction];
            const attractionListJSON = JSON.stringify(updatedList, null, 2); // Indentare de 2 spații
          
            if (point) {
              const blob = new Blob([attractionListJSON], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'attractionList.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          
            return updatedList;
          });
      
          test();
        }
      });
      
      
      
      let element = document.createElement("div");
      element.className =
        "esri-icon-close-circled esri-widget--button esri-widget esri-interactive";
      element.addEventListener("click", function (evt) {
        setAttractionList([]);
        view.graphics.removeAll();
        point = false;
      });
      view.ui.add(element, "bottom-right");

      const restaurantsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/restaurante_bune/FeatureServer/0",
        apiKey:"AAPKd1f15ee0f8074299aa3de44d9b61995dHadi6ohtNHDQcZDq1p3Ga_8Nf56sNG5lM9l44bx7DOeO4Y8hnZKjr_hox0STbORx",
        renderer: restaurantsRenderer,
        popupTemplate: popupTemplate,
      });

      const muzeumsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/muzee/FeatureServer/0",
        apiKey: "AAPKaf6d570e4eda456a91d8e2c8cfcf20c4njy16IId1Hqak68ezzqkUU37sGxZuvG_cc1R69Ojgs57uK6468PUu0_t5YQ8Z_Bg",
        renderer: muzeumsRenderer,
        popupTemplate: popupTemplate,
      });

      const shoppingLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/locuri_shopping/FeatureServer/0",
        apiKey: "AAPK701ab4ad1a1e4fb6bff75045e03050feRbrieK41wDvMC58IcMJKU05SMSiuO75GXTHmCdCNsU1b7WwLzOVQlrN1lhWwdFGs",
        renderer: shoppingRenderer,
        popupTemplate: popupTemplate,
      });

      const buildingsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/cladiri_faimoase/FeatureServer/0",
        apiKey: "AAPK94b4866d870e4bfabac7c3bc9e23d6a4seAL_Wck4h3Os5dcsvnhYWuUzc-zphly6UV7wnXAht-spq7Iwc5qapZ3JC2lNHi_",
        renderer: buildingRenderer,
        popupTemplate: popupTemplate,
      });

      const natureLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/atractii_naturale/FeatureServer/0",
        apiKey: "AAPK22d8d548eb1e402ca9e3f8c1a5fcb096hIhgS3dt0iPZwe3xrHkdNVt3fRcWjY2XDGWPX2NQGNwC41QjTKEOthWBDKDEjx-x",
        renderer: natureRenderer,
        popupTemplate: popupTemplate,
      });

      const countyLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/cOBdu8RarE3m9lLr/arcgis/rest/services/romania1000k/FeatureServer/0",
        apiKey: "AAPKa03ea93284fc4370a3571349ec984eab8VIWzRSn_9n_srbc_sY8cKwD7V8Ua0-1kGeyklM98eTdNbz16RasbOSUrd4-ogyE",
        renderer: countyRenderer,
        popupTemplate: popupTemplateCounty,
      });

      const legend = new Legend(
        {
          view: view,
          layerInfos: [
            {
              layer: natureLayer,
              title: "Natural Attractions",
            },
            {
              layer: muzeumsLayer,
              title: "Museums",
            },
            {
              layer: buildingsLayer,
              title: "Famous Buildings",
            },
            {
              layer: shoppingLayer,
              title: "Shopping Places",
            },
            {
              layer: restaurantsLayer,
              title: "Restaurants",
            },
          ],
          layout: "horizontal",
          style: {
            layout: "auto",
            width: "20px",
          },
        },
      );

      view.ui.add(legend, "bottom-left");

      restaurants && map.add(restaurantsLayer);
      museums && map.add(muzeumsLayer);
      shopping && map.add(shoppingLayer);
      buildings && map.add(buildingsLayer);
      nature && map.add(natureLayer);
      map.add(countyLayer);
    };
    setMap();
  }, [nature, buildings, museums, shopping, restaurants, mapPoint]);

  return (
    <>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem w="100%" h="10">
          <div
            style={{
              height: "80vh",
              aspectRatio: "3/2",
            }}
            ref={MapElement}
          />
          <LayerToogles
            nature={nature}
            buildings={buildings}
            museums={museums}
            shopping={shopping}
            restaurants={restaurants}
            toggleLayer={toggleLayer}
            setAttractionList={setAttractionList}
          />
          <Button colorScheme="blue" onClick={() => point = true}>
            Simulate
          </Button>
        </GridItem>
        <GridItem w="100%" h="10">
          <div
            style={{
              paddingRight: "32px",
              paddingTop: "16px",
            }}
          >
            <h1
              style={{
                display: "flex",
                fontSize: "30px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              Attractions
            </h1>
            <div>
              {attractionsList.map(({ title, address, rating }) => (
                <Box
                  w="100%"
                  margin={4}
                  fontWeight="semibold"
                  mt={3}
                  border={"1px"}
                  p={5}
                >
                  <h5
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {title}
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {address}
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </GridItem>
      </Grid>
    </>
  );
}
export default Map;
