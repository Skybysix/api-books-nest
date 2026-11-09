import argon2 from 'argon2';

// Generamos un hash de la contraseña
const hash1 = await argon2.hash('patata123');

// Generamos otro hash de la misma contraseña
const hash2 = await argon2.hash('patata123');

// Mostramos ambos hashes
console.log(hash1);
console.log(hash2);

// Comprobamos si son iguales
console.log('¿Iguales?', hash1 === hash2);

// Comprobamos la contraseña correcta
console.log('patata123 →', await argon2.verify(hash1, 'patata123'));

// Comprobamos una contraseña incorrecta
console.log('patata124 →', await argon2.verify(hash1, 'patata124'));