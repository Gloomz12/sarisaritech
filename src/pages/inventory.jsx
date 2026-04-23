import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function Inventory() {
  return (
    <div>
      <Header currentPage="Inventory" />
      <h1>Inventory Content</h1>
    </div>
  );
}