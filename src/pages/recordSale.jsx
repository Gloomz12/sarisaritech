import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function RecordSale() {
  return (
    <div>
      <Header currentPage="Record Sale"/>
      <h1>Record Sale Content</h1>
    </div>
  );
}