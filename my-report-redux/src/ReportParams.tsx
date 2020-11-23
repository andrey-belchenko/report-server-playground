
import React, { useEffect, useState } from 'react';
import { data } from './reportsClient';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';


function ReportParams() {

  const list1 = data.list.useData();
  const [year, setYear] = useState("2020");
  const [month, setMonth] = useState("6");
  useEffect(() => {
    data.list.refresh()
  }, []);
  var x = (
    <div>
      <TextBox value={year}
        onValueChanged={data => setYear(data.value)} />
      <TextBox value={month}
        onValueChanged={data => setMonth(data.value)} />
      <SelectBox items={list1} displayExpr="ProjectName" valueExpr="ProjectUID" />
      <Button
        text="Click me"
        onClick={() => data.report.refresh(+year, +month)
        }
      />
    </div>
  );
  return x;
}

export default ReportParams;
