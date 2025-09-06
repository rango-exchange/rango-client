import React from 'react';

import RangoWidget from '../rango-widget';

import styles from './page.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <RangoWidget />
    </main>
  );
}

export default Home;
