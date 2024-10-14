import _sodium from 'libsodium-wrappers-sumo';
import request from './request';


await _sodium.ready;
const sodium = _sodium;


const loginRequest = async (user, session, server) => {
  const path = '/login';
  const query = '';
  const method = 'POST';
  const keypair = user;
  return await request(method, server, path, query, keypair, {
    username: user.username, sessionPublicKey: session.publicKeyBase64
  });
}


const login = async (username, password, server) => {
  const usernameData = new TextEncoder().encode(username);
  const passwordData = new TextEncoder().encode(password);
  const usernameHash = await crypto.subtle.digest('SHA-256', usernameData);
  const salt = new Uint8Array(usernameHash).slice(0, 16);
  const memoryLimit = 2**20 * 1024;
  const alg = sodium.crypto_pwhash_ALG_ARGON2ID13;
  const seed = sodium.crypto_pwhash(32, passwordData, salt, 4, memoryLimit, alg);
  const user = sodium.crypto_sign_seed_keypair(seed);
  user.publicKeyBase64 = sodium.to_base64(user.publicKey);
  user.privateKeyBase64 = sodium.to_base64(user.privateKey);
  user.username = username;
  const session = sodium.crypto_sign_keypair();
  session.publicKeyBase64 = sodium.to_base64(session.publicKey);
  session.privateKeyBase64 = sodium.to_base64(session.privateKey);
  const response = await loginRequest(user, session, server);
  session.createdAt = response.sessionCreatedAt;
  session.expiresAt = response.sessionExpiresAt;
  user.id = response.sessionUser;
  return { user, session };
}


export default login;
