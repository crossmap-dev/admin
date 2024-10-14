import { h, render } from 'preact';
import { useState } from 'preact/hooks';

import LoginForm from './login';


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


const App = ({ server, worker }) => {
  const [auth, setAuth] = useState(null);
  const [error, setError] = useState(null);

  const content = auth
    ? h(ShowAuth, { auth })
    : h(LoginForm, { setAuth, setError, server, worker });

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, error ? [
      content,
      h('span', { style: { color: 'red' } }, error),
    ] : [
      content,
    ]),
  ]);
}


export default App;
