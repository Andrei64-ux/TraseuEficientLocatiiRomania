import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import { storage, db, auth} from "../config/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';
import { VStack, Text, Input, Button, Image, Flex, Box, ListItem, UnorderedList, Center, useToast , Avatar,  HStack, Icon} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";




export default function EmptyPage({ attractionsList, setAttractionsList }) {
  const [user, loading] = useAuthState(auth);
  const [editableUser, setEditableUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [routeHistory, setRouteHistory] = useState([]);

  const [totalRating, setTotalRating] = useState(0);
  const [attractionCount, setAttractionCount] = useState(0);

  const toast = useToast()

  const totalStars = 5;

  // Funcția pentru a afișa lista de atracții pentru fiecare rută separat
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const routesRef = collection(db, 'users', userId, 'routes');
          const routesSnapshot = await getDocs(routesRef);

          let routeCounter = 1;
          let history = [];

          routesSnapshot.forEach((routeDoc) => {
            const routeData = routeDoc.data();
            if (routeData && routeData.attractions && routeData.attractions.length > 0) {
              const routeAttractions = routeData.attractions;

              let attractions = routeAttractions.map((attraction, index) => {
                const rating = parseFloat(attraction.rating.split(":")[1]);
                setTotalRating((prevTotal) => prevTotal + rating);
                setAttractionCount((prevCount) => prevCount + 1);

                return (
                    <ListItem key={`attraction-${index}`}>
                      {`${attraction.title} - ${attraction.address} - ${rating.toFixed(2)}`}
                    </ListItem>
                );
              });

              const averageRating = totalRating / attractionCount;
              const goldenStars = Math.floor(averageRating);

              const routeElement = (
                <VStack key={`route-${routeCounter}`} alignItems='flex-start' borderWidth='1px' p='4' borderRadius='md'>
                  <Text fontSize='lg' fontWeight='bold'>{`Traseul ${routeCounter}`}</Text>
                  <Flex alignItems="center">
                    <Text fontSize='md' marginRight="2">{`Scor ${averageRating.toFixed(2)} `}</Text>
                    <HStack spacing={1}>
                      {[...Array(goldenStars)].map((_, index) => (
                          <Icon key={`golden-star-${index}`} as={StarIcon} color="yellow.400" />
                      ))}
                      {[...Array(totalStars - goldenStars)].map((_, index) => (
                          <Icon key={`gray-star-${index}`} as={StarIcon} color="gray.300" />
                      ))}
                    </HStack>
                  </Flex>
                  <UnorderedList style={{ padding: '8px' }}>{attractions}</UnorderedList>
              </VStack>

              );

              history.push(routeElement);
              routeCounter++;
            }
          });

          setRouteHistory(history);
        }
      } catch (error) {
        console.error('Eroare la accesarea datelor utilizatorului:', error);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    if (user) {
      setEditableUser(user);
      setEmail(user?.email || user.email);
  
      const imageRef = ref(storage, `${user.uid}/avatar`);
  
      getDownloadURL(imageRef)
        .then((imageUrl) => {
          setSelectedImage(imageUrl);
          localStorage.setItem('selectedImage', imageUrl);
        })
        .catch((error) => {
          console.error('Eroare la obtinerea imaginii din Storage:', error);
        });
  
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      getDoc(userDocRef)
        .then((userDocSnapshot) => {
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setName(userData.name || ''); // Setăm numele din Firestore sau lăsăm câmpul gol dacă nu există
          } else {
            setName(''); // Dacă nu există documentul pentru utilizator, lăsăm câmpul gol
          }
        })
        .catch((error) => {
          console.error('Eroare la obținerea datelor utilizatorului:', error);
        });
    }
  }, [user]);
  


  const handleSave = async () => {
    if (auth.currentUser)
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        // Verificăm dacă există deja un document pentru utilizatorul curent
        const userSnapshot = await getDoc(userDocRef);
        
        if (userSnapshot.exists()) {
          // Dacă documentul există, actualizăm câmpul "name"
          await updateDoc(userDocRef, { name: name });
        } else {
          // Dacă nu există, creăm un nou document cu câmpul "name"
          await setDoc(userDocRef, { name: name });
        }

        toast({
          title: 'Numele a fost salvat cu succes!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      } catch (error) {
        console.error('Eroare la salvarea numelui:', error);
        toast({
          title: 'Numele nu a fost salvat!',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
  };
  

  
const handleImageChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    try {
      if (file) {
        const imageRef = ref(storage, `${auth.currentUser.uid}/avatar`);
        
        // Încărcarea imaginii în Firebase Storage
        await uploadString(imageRef, reader.result, 'data_url');
        
        // Obținerea URL-ului pentru imaginea încărcată
        const imageUrl = await getDownloadURL(imageRef);

        // Actualizarea câmpului "avatar" în documentul utilizatorului curent din Firestore
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { avatar: imageUrl });

        // Salvarea URL-ului imaginii în localStorage
        localStorage.setItem('selectedImage', imageUrl);
        setSelectedImage(imageUrl);

        console.log('Imagine incarcata si salvata cu succes!');
      }
    } catch (error) {
      console.error('Eroare la incarcarea sau salvarea imaginii:', error);
    }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};
  

return (
  <Flex justifyContent='center' alignItems='center'>
    <Box width='80%' display='flex'>
      <Box flex='1' paddingRight='20px'>
        <VStack textAlign='left' marginBottom='20px'>
          {editableUser ? (
            <VStack marginBottom='20px'>
              <Input type='file' accept='image/*' width='80%' onChange={handleImageChange} />
              {selectedImage && (
                //<Image src={selectedImage} alt='Selected' boxSize='200px' borderRadius='full' />
                <Avatar size='2xl' src={selectedImage} />
              )}
              <VStack marginBottom='30px'>
                <Input type='text' placeholder={"Write your Name here"} value={name} onChange={(e) => setName(e.target.value)} width='100%' padding='8px' />
                <Box marginBottom='30px'>
                  <Text marginBottom='15px'>Email:</Text>
                  <Text width='100%' padding='8px' display='inline-block' border='1px solid #ccc' borderRadius='5px'>{email}</Text>
                </Box>
              </VStack>
              <Button
                onClick={handleSave}
                padding='10px 20px'
                border='2px solid #333'
                borderRadius='5px'
                cursor='pointer'
                background='#fff'
                color='#333'
                fontSize='16px'
                marginTop='10px'
              >
                Salveaza
              </Button>
              {successMessage && (
                <Text color='green'>{successMessage}</Text>
              )}
              {errorMessage && (
                <Text color='red'>{errorMessage}</Text>
              )}
            </VStack>
          ) : (
            <Text>{loading ? 'Loading...' : 'Utilizatorul nu este autentificat'}</Text>
          )}
        </VStack>
      </Box>
      <Box flex='1' textAlign='left'>
        <Text fontSize='2xl'>Istoric trasee:</Text>
        <VStack id='routeHistory' spacing='4' alignItems='flex-start' mt='4'>
          {routeHistory.length > 0 ? routeHistory : <Text>Nu există trasee salvate</Text>}
        </VStack>
      </Box>
    </Box>
  </Flex>
);
}
