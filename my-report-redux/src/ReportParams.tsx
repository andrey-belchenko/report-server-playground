
import React, { useEffect } from 'react';
import { data } from './reportsClient';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';


function ReportParams() {

  const list = data.list.useValue();
  const year = data.year.useValue();
  const month = data.month.useValue();
  const ProjectUID = data.ProjectUID.useValue();
  useEffect(() => {
    data.year.set(2020);
    data.month.set(6);
    data.ProjectUID.set("A993FABC-7216-EA11-AB0E-000D3A1AF26C");
    data.list.refresh();
  }, []);
  var x = (
    <div>
      <TextBox value={year.toString()}
        onValueChanged={val => data.year.set(val.value)} />
      <TextBox value={month.toString()}
        onValueChanged={val => data.month.set(val.value)} />
      <SelectBox items={list} displayExpr="ProjectName" valueExpr="ProjectUID" value={ProjectUID}
        onValueChanged={val => data.ProjectUID.set(val.value)}
      />
      <Button
        text="Click me"
        onClick={() => {
          data.report.refresh(+year, +month);
          data.projTaskList.refresh(ProjectUID);
        }
        }
      />
    </div>
  );
  return x;
}

export default ReportParams;
