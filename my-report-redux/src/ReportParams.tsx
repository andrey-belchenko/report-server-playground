
import React, { useEffect } from 'react';
import { data } from './reportapi';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';





function ReportParams() {
  const timeStepList = data.timeStepList.useValue();
  const timeStep = data.timeStep.useValue();
  useEffect(() => {
    data.timeStepList.set(
      [
        { id: 'Week', name: 'Неделя' },
        { id: 'Month', name: 'Месяц' },
        { id: 'Quarter', name: 'Квартал' },
        { id: 'Year', name: 'Год' },
      ]);
    data.timeStep.set('Month');
  }, []);
  var x = (
    <div>
      <SelectBox items={timeStepList} displayExpr="name" valueExpr="id" value={timeStep}
        onValueChanged={val => data.timeStep.set(val.value)}
      />
      <Button
        text="Click me"
        onClick={() => {
          data.rmData.refresh(timeStep);
        }
        }
      />
    </div>
  );
  return x;
}

export default ReportParams;
