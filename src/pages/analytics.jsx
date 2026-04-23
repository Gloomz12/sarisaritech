import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function Analytics() {
  return (
    <div>
      <Header currentPage="Analytics" />
      <h1>Analytics Content</h1>
    </div>
  );
}