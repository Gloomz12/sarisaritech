import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../component/header.jsx';

export default function AiInsight() {
  return (
    <div>
      <Header currentPage="AI Insight" />
      <h1>AI Insight Content</h1>
    </div>
  );
}