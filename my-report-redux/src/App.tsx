
import React from 'react';
import './App.css';
import ReportCanvas from './ReportCanvas';
import ReportParams from './ReportParams';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.softblue.css';

function App() {
  var x = (
    <div className="dx-viewport">
      <div id="root">
        <ReportParams />
        <ReportCanvas />
      </div>
    </div>
  );
  return x;
}

export default App;
