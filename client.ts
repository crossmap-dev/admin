import { h, render } from 'preact';
import { useState } from 'preact/hooks';


const SignUpForm = () => {
  const [email, setEmail] = useState('');

  return h('form',
    {
      id: 'signup-form',
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }, [
    h('input', {
      id: 'email',
      type: 'text',
      placeholder: 'Email',
      onInput: (e: any) => setEmail(e.target.value),
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
      id: 'signup-button',
      type: 'submit',
      onClick: (e: any) => {
        e.preventDefault();
        console.log(email);
      },
      style: {
        color: 'inherit',
        backgroundColor: 'inherit',
        border: 'none',
      }
    }, 'Sign Up'),
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
      h(SignUpForm),
    ]),
  ]);
}


render(h(App), document.body);
