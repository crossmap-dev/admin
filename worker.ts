import _sodium from 'libsodium-wrappers-sumo';
import { v4 as uuidv4 } from 'uuid';


const API_SERVER = 'api.crossmap.dev';


await _sodium.ready;
const sodium = _sodium;


const stringToSign = (requestId, method, host, path, query) => {
  return `${requestId} ${method} ${host}${path}${query}`;
}


const signRequest = (requestId, method, host, path, query, keypair) => {
  const s = stringToSign(requestId, method, host, path, query);
  const signature = sodium.crypto_sign_detached(s, keypair.privateKey);
  return sodium.to_base64(signature);
}


const signedRequestHeaders = (requestId, method, host, path, query, keypair) => {
  const signature = signRequest(requestId, method, host, path, query, keypair);
  return {
    'X-CROSSMAP-Request-Id': requestId,
    'X-CROSSMAP-Public-Key': keypair.publicKeyBase64,
    'Authorization': `Signature ${signature}`,
  };
}


const request = async (method, host, path, query, keypair, body = null) => {
  const requestId = uuidv4();
  const headers = signedRequestHeaders(requestId, method, host, path, query, keypair);
  headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';
  if (body) {
    return await fetch(`https://${host}${path}${query}`, {
      method, headers, body: JSON.stringify(body)
    }).then(response => response.json());
  } else {
    return await fetch(`https://${host}${path}${query}`, { method, headers })
      .then(response => response.json());
  }
}


const login = async (user, session, server) => {
  const path = '/login';
  const query = '';
  const method = 'POST';
  const keypair = user;
  return await request(method, server, path, query, keypair, {
    username: user.username, sessionPublicKey: session.publicKeyBase64
  });
}


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
      const user = sodium.crypto_sign_seed_keypair(seed);
      user.publicKeyBase64 = sodium.to_base64(user.publicKey);
      user.privateKeyBase64 = sodium.to_base64(user.privateKey);
      user.username = username;
      const session = sodium.crypto_sign_keypair();
      session.publicKeyBase64 = sodium.to_base64(session.publicKey);
      session.privateKeyBase64 = sodium.to_base64(session.privateKey);
      const response = await login(user, session, API_SERVER);
      session.createdAt = response.sessionCreatedAt;
      session.expiresAt = response.sessionExpiresAt;
      user.id = response.sessionUser;
      postMessage({ type: 'login', payload: { session, user } });
    }
  }
}
