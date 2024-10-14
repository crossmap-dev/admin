import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';


const API_SERVER = 'api.crossmap.dev';


const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });


const LoginForm = ({ setAuth, server }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case 'login': {
          setProcessing(false);
          setAuth(payload);
        }
      }
    }
  }, []);

  if (processing) {
    return h('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
      h('h3', null, 'Logging you in...')
    ]);
  }

  return h('form',
    {
      id: 'login-form',
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
    h('input', {
      id: 'username',
      type: 'text',
      placeholder: 'Username',
      onInput: (e: any) => setUsername(e.target.value),
      style: {
        display: 'inline-block',
        color: 'inherit',
        backgroundColor: 'inherit',
        minWidth: '20rem',
        border: 'none',
        borderBottom: '1px solid',
      }
    }),
    h('input', {
      id: 'password',
      type: 'password',
      placeholder: 'Password',
      onInput: (e: any) => setPassword(e.target.value),
      style: {
        display: 'inline-block',
        color: 'inherit',
        backgroundColor: 'inherit',
        minWidth: '20rem',
        border: 'none',
        borderBottom: '1px solid',
      }
    }),
    h('button', {
      id: 'login-button',
      type: 'submit',
      onClick: (e: any) => {
        e.preventDefault();
        setProcessing(true);
        worker.postMessage({
          type: 'login',
          payload: {
            username,
            password,
            server,
          }
        });
      },
      style: {
        color: 'inherit',
        backgroundColor: 'inherit',
        border: 'none',
      }
    }, 'Login'),
  ]);
}


const ShowAuth = ({ auth: { user, session } }) => {
  return h('div', null, [
    h('h3', null, 'User ID:'),
    h('p', null, user.id),
    h('h3', null, 'User Public Key:'),
    h('p', null, user.publicKeyBase64),
    h('h3', null, 'User Private Key:'),
    h('p', null, user.privateKeyBase64),
    h('h3', null, 'Session Created At:'),
    h('p', null, session.createdAt),
    h('h3', null, 'Session Expires At:'),
    h('p', null, session.expiresAt),
    h('h3', null, 'Session Public Key:'),
    h('p', null, session.publicKeyBase64),
    h('h3', null, 'Session Private Key:'),
    h('p', null, session.privateKeyBase64),
  ]);
}


const App = () => {
  const [auth, setAuth] = useState(null);
  const server = API_SERVER;

  const content = auth
    ? h(ShowAuth, { auth })
    : h(LoginForm, { setAuth, server });

  return h('div', {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    }
  }, [
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        margin: '1rem',
      }
    }, [
      h('h1', null, 'Community'),
      h('h1', null, 'Run'),
      h('h1', null, 'Open'),
      h('h1', null, 'Source'),
      h('h1', null, 'Social'),
      h('h1', null, 'Media'),
      h('h1', null, 'Application'),
      h('h1', null, 'Platform'),
    ]),
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
      content,
    ]),
  ]);
}


render(h(App), document.body);
