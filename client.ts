import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';


const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case 'login': {
          setProcessing(false);
          console.log('keypair:', payload.keypair);
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


const App = () => {
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
      h(LoginForm),
    ]),
  ]);
}


render(h(App), document.body);
