
import React from 'react';
import { data, rmDataItem } from './reportapi';



function main(rows: rmDataItem[]) {
  var x = [];
  for (let row of rows) {
    x.push(<div>{row.XLabel}</div>);
  }
  return x;
}

function ReportCanvas() {
  const rmData = data.rmData.useValue();
  var x = (
    <div>
      <div>
        Report
        {main(rmData)}
      </div>
    </div>
  );
  return x;
}

export default ReportCanvas;
