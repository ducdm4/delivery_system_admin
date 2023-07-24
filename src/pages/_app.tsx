import '../styles/globals.css';
import '../styles/style.scss';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import store from '../store';
import Layout from '../common/components/default/layout';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
    </Provider>
  );
}
