import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { useState, useEffect } from 'react';

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

  // Funcția pentru a afișa lista de atracții
  useEffect(() => {
    // Actualizăm starea pentru lista de atracții folosind lista primită din Map
    if (attractionsList && attractionsList.length > 0) {
      setAttractionsList(attractionsList);
    }
  }, [attractionsList, setAttractionsList]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('savedUser'));

    if (user) {
      setEditableUser(user);
      setName(savedUser?.displayName || user.displayName);
      setEmail(savedUser?.email || user.email);
      setPassword(savedUser?.password || ''); // Actualizăm parola din starea utilizatorului
      const savedImage = localStorage.getItem('selectedImage');
      if (savedImage) {
        setSelectedImage(savedImage);
      }
    }
  }, [user]);

  const handleSave = () => {
    const savedSuccessfully = true; // Înlocuiește cu logica ta reală de salvare

    if (savedSuccessfully) {
      setSuccessMessage('Modificarile s-au realizat cu succes.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setErrorMessage('Nu s-au putut salva modificările. Te rog să încerci din nou.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setEditableUser({
      ...editableUser,
      displayName: name,
      email: email,
      password: password,
    });

    localStorage.setItem('savedUser', JSON.stringify({ displayName: name, email: email, password: password }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
      localStorage.setItem('selectedImage', reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
        <div style={{ flex: '1', textAlign: 'left' }}>
          {editableUser ? (
            <div>
              <p>
                Nume: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </p>
              <p>
                Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </p>
              <p>
                Parolă: 
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Ascunde Parola' : 'Arată Parola'}
                </button>
              </p>
              {/* Afișarea listei de atracții */}
              <div>
                <h2>Lista de Atracții:</h2>
                <ul>
                  {attractionsList && attractionsList.length > 0 ? (
                    attractionsList.map((attraction, index) => (
                      <li key={index}>
                        <p>{attraction.title}</p>
                        <p>{attraction.address}</p>
                        {/* Poți adăuga și rating-ul aici */}
                        {/* <p>Rating: {attraction.rating}</p> */}
                      </li>
                    ))
                  ) : (
                    <li>No attractions available</li>
                  )}
                </ul>
              </div>
              <button onClick={handleSave} style={{
                  padding: '10px 20px',
                  border: '2px solid #333',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  background: '#fff',
                  color: '#333',
                  fontSize: '16px',
                  marginTop: '10px',
                }}>Salvează</button>
              {successMessage && (
                <p style={{ color: 'green' }}>{successMessage}</p>
              )}
              {errorMessage && (
                <p style={{ color: 'red' }}>{errorMessage}</p>
              )}
            </div>
          ) : (
            <p>{loading ? 'Încărcare...' : 'Utilizatorul nu este autentificat'}</p>
          )}
        </div>
        <div style={{ flex: '1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Adăugăm și partea pentru încărcarea imaginii */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {selectedImage && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={selectedImage}
                alt="Selected"
                style={{ width: '200px', height: '200px', borderRadius: '50%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
