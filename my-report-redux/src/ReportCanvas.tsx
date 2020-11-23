
import React from 'react';
import { data } from './reportsClient';

function ReportCanvas() {
  const reportData = data.report.useValue();
  const month = data.month.useValue();
  var x = (
    <div>
      <ul>
        <div>{month}</div>
        {reportData.map(item => (
          <li key={item.ProjectUID}>
            {item.ProjectUID} {item.MonthName}
          </li>
        ))}
      </ul>
    </div>
  );
  return x;
}

export default ReportCanvas;
