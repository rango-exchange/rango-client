import { useManager } from "@rangodev/queue-manager-react";
import React from "react";

function History() {
  const id = "xxxx-x-xxx-x-xx-x-x-x--xx";
  const { manager } = useManager();
  const storage = manager?.getAll() || new Map();
  const queues: React.ReactNode[] = [];

  storage.forEach((v, k) => {
    const tasks = v.list.state.tasks;
    const taskIds = Object.keys(tasks);
    queues.push(
      <div className="q" id={`q-${k}`}>
        <h4>
          Queue {v.name} ({k}){" "}
          <span className={`status ${v.list.state.status.toLowerCase()}`}>
            {v.list.state.status}
          </span>
        </h4>
        <div className="q-list">
          {taskIds.map((id) => {
            const taskStatus = tasks[id].status;
            return (
              <div className="task" id={`t-${id}`}>
                <div className="id tooltip">
                  Task ...{id.slice(-4)}{" "}
                  <span className="tooltiptext">{id}</span>
                </div>
                <div className={`status ${taskStatus.toLowerCase()}`}>
                  {taskStatus}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
  return <div className="queues">{queues}</div>;
}

export { History };
