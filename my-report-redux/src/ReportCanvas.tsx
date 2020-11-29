
import React from 'react';
import { data, projTaskListItem } from './reportsClient';

function showTasks(tasks:projTaskListItem[]) {
  var x = [];
  for (let task of tasks) {
    x.push(<div>{task.TaskUID}</div>);
  }
  return x;
}

function ReportCanvas() {
  const reportData = data.report.useValue();
  const month = data.month.useValue();
  const tasks = data.projTaskList.useValue();
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
      <ul>
        <div>Tasks count:{tasks.length}</div>
        {showTasks(tasks)}
      </ul>
    </div>
  );
  return x;
}

export default ReportCanvas;
