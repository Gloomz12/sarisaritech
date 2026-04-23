import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function Restock() {
  return (
    <div>
      <Header currentPage="Restock"/>
      <h1>Restock Content</h1>
    </div>
  );
}