import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';


const LoginForm = ({ setAuth, setError, server, worker }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case 'login': {
          if (payload instanceof Error) {
            console.log(e);
            console.log(payload.message);
            setError(payload.message);
            setProcessing(false);
          } else {
            setAuth(payload);
            setError(null);
            setProcessing(false);
          }
        }
      }
    }
  }, []);

  if (processing) {
    return h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
      h('h3', null, 'Logging you in...'),
      h('span', { className: 'spinner' }),
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
        setError(null);
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


export default LoginForm;
