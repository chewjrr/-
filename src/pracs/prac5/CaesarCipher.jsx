import React, { useState } from 'react';
import './CaesarCipher.css';

const CaesarCipher = () => {
  const [encryptMessage, setEncryptMessage] = useState('');
  const [encryptShift, setEncryptShift] = useState(3);
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptMessage, setDecryptMessage] = useState('');
  const [decryptShift, setDecryptShift] = useState(3);
  const [decryptedMessage, setDecryptedMessage] = useState('');

  const handleEncrypt = () => {
    const encrypted = caesarCipher(encryptMessage, encryptShift);
    setEncryptedMessage(encrypted);
  };

  const handleDecrypt = () => {
    const decrypted = caesarCipher(decryptMessage, -decryptShift);
    setDecryptedMessage(decrypted);
  };

  const caesarCipher = (text, shift) => {
    return text.replace(/[а-яА-Яa-zA-Z]/g, (char) => {
      const base = char.toLowerCase() === char ? (char < 'а' ? 97 : 1072) : (char < 'А' ? 65 : 1040);
      const size = char.toLowerCase() === char ? (char < 'а' ? 26 : 32) : (char < 'А' ? 26 : 32);
      return String.fromCharCode(((char.charCodeAt(0) - base + shift + size) % size) + base);
    });
  };

  return (
    <div className="caesar-cipher-container">
      <div className="encrypt-container">
        <h2>Зашифровать</h2>
        <label htmlFor="encryptMessage">Ввод сообщения</label>
        <input
          type="text"
          id="encryptMessage"
          value={encryptMessage}
          onChange={(e) => setEncryptMessage(e.target.value)}
        />
        <label htmlFor="encryptShift">Смещение</label>
        <input
          type="number"
          id="encryptShift"
          value={encryptShift}
          onChange={(e) => setEncryptShift(parseInt(e.target.value))}
        />
        <button onClick={handleEncrypt}>Зашифровать</button>
        <label htmlFor="encryptedMessage">Зашифрованное сообщение</label>
        <input
          type="text"
          id="encryptedMessage"
          value={encryptedMessage}
          readOnly
        />
      </div>
      <div className="decrypt-container">
        <h2>Расшифровать</h2>
        <label htmlFor="decryptMessage">Ввод зашифрованного сообщения</label>
        <input
          type="text"
          id="decryptMessage"
          value={decryptMessage}
          onChange={(e) => setDecryptMessage(e.target.value)}
        />
        <label htmlFor="decryptShift">Смещение</label>
        <input
          type="number"
          id="decryptShift"
          value={decryptShift}
          onChange={(e) => setDecryptShift(parseInt(e.target.value))}
        />
        <button onClick={handleDecrypt}>Расшифровать</button>
        <label htmlFor="decryptedMessage">Расшифрованное сообщение</label>
        <input
          type="text"
          id="decryptedMessage"
          value={decryptedMessage}
          readOnly
        />
      </div>
    </div>
  );
};

export default CaesarCipher;
