import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5231/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);



  return (
    <div className="App">
      <table>
        <tr>
          <th>Full Link</th>
          <th>Short Link</th>
        </tr>

        {data ? data.map(items => <><tr><td>https://{items.link}</td><td>https://url.com/{items.code}</td></tr></>) : <p>Loading...</p>}
        
      </table>
    </div>
  );
}

export default App;