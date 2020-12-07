
import React, { useEffect } from 'react';
import { data } from './reportapi';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DateBox, { CalendarOptions } from 'devextreme-react/date-box';
import { CheckBox } from 'devextreme-react';
import Form, { Item } from 'devextreme-react/form';



function ReportParams() {
  const timeStepList = data.timeStepList.useValue();
  const timeStep = data.timeStep.useValue();
  const startDate = data.startDate.useValue();
  const endDate = data.endDate.useValue();
  const expandProjects = data.expandProjects.useValue();
  const expandStages = data.expandStages.useValue();

  useEffect(() => {
    data.timeStepList.set(
      [
        { id: 'Week', name: 'Неделя' },
        { id: 'Month', name: 'Месяц' },
        { id: 'Quarter', name: 'Квартал' },
        { id: 'Year', name: 'Год' },
      ]);
    data.timeStep.set('Month');
    data.startDate.set(new Date(new Date().getFullYear(), 0, 1));
    data.endDate.set(new Date());
    data.expandProjects.set(false);
    data.expandStages.set(false);
  }, []);
  var x = (
    <div>
      <Form colCount={3}>

        <Item  itemType="group">
          <Item label={{ text: "Масштаб", showColon: false }}>
        
          </Item>

          <Item>
            <SelectBox items={timeStepList} displayExpr="name" valueExpr="id" value={timeStep}
              onValueChanged={val => data.timeStep.set(val.value)}
            />
          </Item>
        </Item>

        <Item caption="период отчета" itemType="group">
          <Item label={{ text: "с" , showColon: false}}>
            <DateBox value={startDate}
              onValueChanged={val => data.startDate.set(val.value)} displayFormat="MM.yyyy">
              <CalendarOptions maxZoomLevel="year" minZoomLevel="decade" zoomLevel="year" />
            </DateBox>
          </Item>
          <Item label={{ text: "по" , showColon: false}}>
            <DateBox value={endDate}
              onValueChanged={val => data.endDate.set(val.value)} displayFormat="MM.yyyy">
              <CalendarOptions maxZoomLevel="year" minZoomLevel="decade" zoomLevel="year" />
            </DateBox>
          </Item>
        </Item>
        <Item caption="развернуть" itemType="group">

          <Item label={{ text: "проекты", showColon: false }}>
            <CheckBox value={expandProjects}
              onValueChanged={val => data.expandProjects.set(val.value)} />
          </Item>
          <Item label={{ text: "этапы", showColon: false }}>
            <CheckBox value={expandStages}
              onValueChanged={val => data.expandStages.set(val.value)} />
          </Item>
        </Item>

      </Form>





      <Button text="Click me"
        onClick={() => {
          data.rmData.refresh(timeStep);
        }
        } />




    </div>
  );
  return x;
}

export default ReportParams;
