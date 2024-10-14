import login from './src/login';


onmessage = async (e) => {
  const { type, payload } = e.data;
  switch (type) {
    case 'login': {
      const { username, password, server } = payload;
      const response = await login(username, password, server);
      postMessage({ type: 'login', payload: response });
    }
  }
}
