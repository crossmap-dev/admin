import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import App from './src/components/app';

const server = 'api.crossmap.dev';
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

render(h(App, { server, worker }), document.body);
