import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export interface rmDataItem {
    Level: number;
    IsPlan: number;
    ProjectUID: string;
    StageUID: string;
    PositionUID: string;
    DepartmentName: string;
    XLabel: string;
    ProjectName: string;
    StageName: string;
    StageNumber: string;
    PositionName: string;
    YearLabel: string;
    MonthLabel: string;
    QuarterLabel: string;
    WeekLabel: string;
    Date: Date;
    RowNum: number;
    
}
export interface timeStepListItem {
    id: string;
    name: string;
    
}



interface IState {
  rmData: rmDataItem[];
  timeStepList: timeStepListItem[];
  timeStep: string;
  
}

const slice = createSlice({
  name: 'reportData',
  initialState: {
    rmData: new Array<rmDataItem>(),
    timeStepList: new Array<timeStepListItem>(),
    timeStep: "",
    
  },
  reducers: {
    rmData: (state: IState, action) => {
        state.rmData = action.payload;
    },
    timeStepList: (state: IState, action) => {
        state.timeStepList = action.payload;
    },
    timeStep: (state: IState, action) => {
        state.timeStep = action.payload;
    },
    
  },
});


const reportStore = configureStore({
  reducer: slice.reducer
});
export { reportStore };

const baseUrl = "http://localhost:3004/datasets";

const load = (dsName: string, params: any) => {
  fetch(`${baseUrl}/${dsName}/data`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  )
    .then(res => res.json())
    .then(
      (result) => {
        let actions: any = slice.actions;
        reportStore.dispatch(actions[dsName](result));
      }
    );
}

const data = {
  rmData: {
      useValue: () => useSelector((state: IState) => state.rmData),
      refresh: (timeStep: string,) => load("rmData", {timeStep,})
  },
  timeStepList: {
      useValue: () => useSelector((state: IState) => state.timeStepList),
      set: (value: object) => reportStore.dispatch(slice.actions.timeStepList(value))
  },
  timeStep: {
      useValue: () => useSelector((state: IState) => state.timeStep),
      set: (value: string) => reportStore.dispatch(slice.actions.timeStep(value))
  },
  
}
export { data }




