import _sodium from 'libsodium-wrappers-sumo';

await _sodium.ready;
const sodium = _sodium;


console.log('worker loaded');
console.log('sodium:', sodium);


onmessage = async (e) => {
  const { type, payload } = e.data;
  switch (type) {
    case 'login': {
      const { username, password } = payload;
      const passwordData = new TextEncoder().encode(password);
      const usernameData = new TextEncoder().encode(username);
      const usernameSalt = new Uint8Array(await crypto.subtle.digest('SHA-256', usernameData)).slice(0, 16);
      const memoryLimit = 2**20 * 1024;
      const seed = sodium.crypto_pwhash(32, passwordData, usernameSalt, 4, memoryLimit, sodium.crypto_pwhash_ALG_ARGON2ID13);
      const keypair = sodium.crypto_sign_seed_keypair(seed);
      keypair.publicKeyBase64 = sodium.to_base64(keypair.publicKey);
      keypair.privateKeyBase64 = sodium.to_base64(keypair.privateKey);
      console.log('keypair:', keypair);
      postMessage({ type: 'login', payload: { keypair } });
    }
  }
}
