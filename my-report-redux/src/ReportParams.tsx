
import React, { useEffect } from 'react';
import { data } from './reportsClient';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';


function ReportParams() {

  const list = data.list.useValue();
  const year = data.year.useValue();
  const month = data.month.useValue();

  useEffect(() => {
    data.year.set(2020);
    data.month.set(6);
    data.list.refresh();
  }, []);
  var x = (
    <div>
      <TextBox value={year.toString()}
        onValueChanged={val => data.year.set(val.value)} />
      <TextBox value={month.toString()}
        onValueChanged={val => data.month.set(val.value)} />
      <SelectBox items={list} displayExpr="ProjectName" valueExpr="ProjectUID" />
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
