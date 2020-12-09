
import React, { useEffect, useState } from 'react';
import { data } from './reportapi';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import DateBox, { CalendarOptions } from 'devextreme-react/date-box';
import { CheckBox } from 'devextreme-react';
import Form, { Item, RequiredRule } from 'devextreme-react/form';
import dxForm from 'devextreme/ui/form';




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
    // data.timeStep.set('Month');
    data.startDate.set(new Date(new Date().getFullYear(), 0, 1));
    data.endDate.set(new Date());
    data.expandProjects.set(false);
    data.expandStages.set(false);
  }, []);

  const [form, setForm] = useState<any>();
  //var form: dxForm | undefined = undefined;

  var x = (
    <div>
      <Form colCount={3} onInitialized={(e) => { alert("c"); setForm(e.component) }}>

        <Item itemType="group">
          <Item itemType="empty">
          </Item>
          <Item editorType="dxSelectBox"
            editorOptions={{
              items: timeStepList, displayExpr: "name", valueExpr: "id", value: timeStep, placeholder: "Масштаб",
              onValueChanged: (val: any) => data.timeStep.set(val.value)
            }}
          >
            <RequiredRule message="Email is required" />
          </Item>
        </Item>

        <Item itemType="group">
          <Item>
            Период отчета
          </Item>
          <Item label={{ text: "с", showColon: false }}>
            <DateBox value={startDate}
              onValueChanged={val => data.startDate.set(val.value)} displayFormat="MM.yyyy">
              <CalendarOptions maxZoomLevel="year" minZoomLevel="decade" zoomLevel="year" />
            </DateBox>
          </Item>
          <Item label={{ text: "по", showColon: false }}>
            <DateBox value={endDate}
              onValueChanged={val => data.endDate.set(val.value)} displayFormat="MM.yyyy">
              <CalendarOptions maxZoomLevel="year" minZoomLevel="decade" zoomLevel="year" />
            </DateBox>
          </Item>
        </Item>
        <Item itemType="group">
          <Item editorType="dxCheckBox" editorOptions={{
            value: expandProjects,
            text: "Развернуть все проекты",
            onValueChanged: (val: any) => data.expandProjects.set(val.value)
          }} />
          <Item editorType="dxCheckBox" editorOptions={{
            value: expandStages,
            text: "Развернуть все этапы",
            onValueChanged: (val: any) => data.expandStages.set(val.value)
          }} />
        </Item>


      </Form>





      <Button text="Click me"
        onClick={() => {
          if (!form) {
            alert("f");
          }
          let v = form?.validate();
          //alert(JSON.stringify(v));

          //data.rmData.refresh(timeStep);
        }
        } />




    </div>
  );
  return x;
}

export default ReportParams;
