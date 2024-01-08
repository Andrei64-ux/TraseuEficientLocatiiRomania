import React, { useEffect, useRef, useState } from "react";
import {Center, FormLabel, Switch, SimpleGrid, Button, useToast} from "@chakra-ui/react";
import {layersInfo} from "../utils/constants";
import { getFirestore, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";

export default function Form() {

    const [nature, setNature] = useState(false);
    const [museums, setMuseums] = useState(false);
    const [shopping, setShopping] = useState(false);
    const [buildings, setBuildings] = useState(false);
    const [restaurants, setRestaurants] = useState(false);

    const toast = useToast();

    const user = auth.currentUser;

    const handleSaveData = async () => {
        if (user) {
            const userId = user.uid;

            const attractionPrefsRef = doc(db, 'users', userId, 'attractionPrefs', 'attractions');

            const attractions = {
                nature: nature,
                museums: museums,
                shopping: shopping,
                buildings: buildings,
                restaurants: restaurants
            }

            getDoc(attractionPrefsRef)
                .then((docSnapshot) => {
                    if(docSnapshot.exists()) {
                        setDoc(attractionPrefsRef, attractions)
                            .then(() => {
                                console.log('Preferinte actractii actualizate cu succes!');
                            })
                            .catch((error) => {
                                console.error('Eroare la actualizare preferinte atractii:', error);
                            })
                    } else {
                        setDoc(attractionPrefsRef, attractions)
                            .then(() => {
                                console.log('Prefereinte actractii create cu succes!');
                            })
                            .catch((error) => {
                                console.error('Eroare la creare preferinte atractii:', error);
                            })
                    }
                })
                .catch((error) => {
                    console.error('Eroare la verificare preferinte atractii:', error);
                })

            toast({
                title: 'Attractions preferences saved',
                description: "We've saved your preferences.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })

        } else {
            console.error('Utilizatorul nu este autentificat!');
        }
    }

    const handleSwitchChange = (attraction, newValue) => {
        // Update the state based on the attraction and new value
        switch (attraction) {
            case 'nature':
                setNature(newValue);
                break;
            case 'museums':
                setMuseums(newValue);
                break;
            case 'shopping':
                setShopping(newValue);
                break;
            case 'buildings':
                setBuildings(newValue);
                break;
            case 'restaurants':
                setRestaurants(newValue);
                break;
            default:
                break;
        }
    }

    return (
        <form>
            <Center>
                <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={5} marginTop={"1rem"}>
                    {layersInfo.map(({ layerName, layerLabel }) => (
                        <>
                            <FormLabel>{layerLabel}</FormLabel>
                            <Switch
                                colorScheme="teal"
                                size="md"
                                onChange={(event) => handleSwitchChange(layerName, event.target.checked)}
                            />
                        </>
                    ))}
                </SimpleGrid>

            </Center>
            <Center marginTop={"1rem"}>
                <Button
                    mt="4"
                    colorScheme="teal"
                    size="md"
                    w="20%"
                    onClick={handleSaveData}
                >
                    Save data
                </Button>
            </Center>
        </form>
    )
}