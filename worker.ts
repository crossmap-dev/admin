import login from './src/login';


onmessage = async (e) => {
  const { type, payload } = e.data;
  switch (type) {
    case 'login': {
      const { username, password, server } = payload;
      postMessage({
        type: 'login',
        payload: await login(username, password, server)
      });
    }
  }
}
