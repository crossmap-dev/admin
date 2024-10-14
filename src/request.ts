import { v4 as uuidv4 } from 'uuid';
import _sodium from 'libsodium-wrappers-sumo';


await _sodium.ready;
const sodium = _sodium;


class RequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}


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

  const params = { method, headers };

  if (body) {
    params.body = JSON.stringify(body);
  }

  const response = await fetch(`https://${host}${path}${query}`, params);
  if (!response.ok) {
    throw new RequestError(response.statusText, response.status);
  }

  return await response.json();
}


export default request;
export { signedRequestHeaders, signRequest, stringToSign, RequestError };
