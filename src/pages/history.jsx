import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function History() {
  return (
    <div>
      <Header currentPage="History" />
      <h1>History Content</h1>
    </div>
  );
}