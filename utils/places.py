api_key = "AIzaSyA1YQBEc8yaXIU3tpGuBXw58HDpRo9k4Zs"

import googlemaps
import pandas as pd

mapClient = googlemaps.Client(api_key)

countySeats = [
    "Alba Iulia",
    "Arad",
    "Arges",
    "Bacau",
    "Bihor",
    "Bistrita-Nasaud",
    "Botosani",
    "Brasov",
    "Braila",
    "Bucuresti",
    "Buzau",
    "Caras-Severin",
    "Calarasi",
    "Cluj",
    "Constanta",
    "Covasna",
    "Dambovita",
    "Dolj",
    "Galati",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomita",
    "Iasi",
    "Ilfov",
    "Maramures",
    "Mehedinti",
    "Mures",
    "Neamt",
    "Olt",
    "Prahova",
    "Satu Mare",
    "Salaj",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timis",
    "Tulcea",
    "Vaslui",
    "Valcea",
    "Vrancea",
]

themes = ["atractii naturale ", "cladiri faimoase ", "muzee ", "restaurante bune ", "locuri shopping "]

# lat, lng = 46.07327249999999, 23.5804886
# query = themes[0] + countySeats[0]
# response = mapClient.places(
#     location=(lat, lng),
#     query=query,
#     radius=6000
# )
# results = response.get('results')
# for result in results:
#     result['gpsCoordinates'] = {"latitude": result['geometry']['location']['lat'], "longitude": result['geometry']['location']['lng']}
#     del result['geometry']
#     del result['icon']

# print(results)

for theme in themes:
    business_list = []
    index = 0
    with open("data/coordinates.txt", "rt") as f:
        for line in f.readlines():
            lat, lng = float(line.split(', ')[0]), float(line.split(', ')[1])
            query = theme + countySeats[index]
            response = mapClient.places(
                location=(lat, lng),
                query=query,
                radius=6000
            )
            results = response.get('results')
            for result in results:
                result["latitude"] = result['geometry']['location']['lat']
                result["longitude"] = result['geometry']['location']['lng']
                del result['geometry']
                del result['icon']
                del result['icon_background_color']
                del result['icon_mask_base_uri']
                if 'opening_hours' in result.keys():
                    del result['opening_hours']
                if 'photos' in result.keys():
                    del result['photos']
                if 'plus_code' in result.keys():
                    del result['plus_code']
                del result['reference']
            business_list.extend(results)
            index += 1
        df = pd.DataFrame(business_list)
        df.to_string()
        df['url'] = 'https://www.google.com/maps/place/?q=place_id:' + df['place_id']
        df.to_csv('{0}.csv'.format(theme), index=False)
