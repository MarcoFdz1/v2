// TEST PAGE - Direct API test
import React, { useEffect, useState } from 'react';

function TestPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('https://one-production-6db5.up.railway.app/api/settings')
      .then(r => r.json())
      .then(data => {
        console.log('Direct API test:', data);
        setData(data);
      })
      .catch(err => {
        console.error('API Error:', err);
        setData({ error: err.message });
      });
  }, []);
  
  return (
    <div style={{padding: '20px', backgroundColor: 'white', color: 'black'}}>
      <h1>API Test Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data?.logoUrl && (
        <div>
          <h2>Logo Test:</h2>
          <img src={data.logoUrl} alt="Logo" style={{maxWidth: '200px'}} />
        </div>
      )}
      {data?.loginBackgroundUrl && (
        <div>
          <h2>Background Test:</h2>
          <img src={data.loginBackgroundUrl} alt="Background" style={{maxWidth: '200px'}} />
        </div>
      )}
    </div>
  );
}

export default TestPage;