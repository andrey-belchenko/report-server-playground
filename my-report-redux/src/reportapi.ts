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
  timeStep: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  expandProjects: boolean | undefined;
  expandStages: boolean | undefined;
  
}

const slice = createSlice({
  name: 'reportData',
  initialState: {
    rmData: new Array<rmDataItem>(),
    timeStepList: new Array<timeStepListItem>(),
    timeStep: undefined,
    startDate: undefined,
    endDate: undefined,
    expandProjects: undefined,
    expandStages: undefined,
    
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
    startDate: (state: IState, action) => {
        state.startDate = action.payload;
    },
    endDate: (state: IState, action) => {
        state.endDate = action.payload;
    },
    expandProjects: (state: IState, action) => {
        state.expandProjects = action.payload;
    },
    expandStages: (state: IState, action) => {
        state.expandStages = action.payload;
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
      refresh: (timeStep: string | undefined,) => load("rmData", {timeStep,})
  },
  timeStepList: {
      useValue: () => useSelector((state: IState) => state.timeStepList),
      set: (value: timeStepListItem[]) => reportStore.dispatch(slice.actions.timeStepList(value))
  },
  timeStep: {
      useValue: () => useSelector((state: IState) => state.timeStep),
      set: (value: string | undefined) => reportStore.dispatch(slice.actions.timeStep(value))
  },
  startDate: {
      useValue: () => useSelector((state: IState) => state.startDate),
      set: (value: Date | undefined) => reportStore.dispatch(slice.actions.startDate(value))
  },
  endDate: {
      useValue: () => useSelector((state: IState) => state.endDate),
      set: (value: Date | undefined) => reportStore.dispatch(slice.actions.endDate(value))
  },
  expandProjects: {
      useValue: () => useSelector((state: IState) => state.expandProjects),
      set: (value: boolean | undefined) => reportStore.dispatch(slice.actions.expandProjects(value))
  },
  expandStages: {
      useValue: () => useSelector((state: IState) => state.expandStages),
      set: (value: boolean | undefined) => reportStore.dispatch(slice.actions.expandStages(value))
  },
  
}
export { data }




