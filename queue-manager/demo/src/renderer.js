import { Status } from "@rango/queue-manager-core";


export function renderQueue(data){
  const list = document.querySelector(".queues");
  
  const {id, status, tasks} = data;
  
  const qEl = document.createElement("div");
  qEl.classList.add("q");
  qEl.id = `q-${id}`;

  const titleEl = document.createElement("h4");
  titleEl.textContent = `Queue ${id}`;

  const titleStatusEl = document.createElement("span");
  titleStatusEl.classList.add("status");
  titleStatusEl.classList.add(status.toLowerCase());
  titleStatusEl.textContent = status;
  

  const qListEl =  document.createElement("div");
  qListEl.classList.add("q-list");

  // TODO: add tasks

  titleEl.appendChild(titleStatusEl);
  
  qEl.appendChild(titleEl);
  qEl.appendChild(qListEl);
  list.appendChild(qEl);  

}
export function renderUpdatedQueueStatus(qId, status){
  const queueStausEl = document.querySelector(`#q-${qId} h4 .status`);
  queueStausEl.className = "";
  queueStausEl.classList.add("status");
  queueStausEl.classList.add(status.toLowerCase());

  queueStausEl.textContent = status;
}

export function renderTask(qId, data){

  const {id, task: status} = data;
  const queueEl = document.querySelector(`#q-${qId} .q-list`);

  if(!queueEl){
    console.warn(`queue ${qId} didn't found on DOM.`)
    return;
  }
  
  const taskEl = document.createElement("div");
  taskEl.classList.add("task");
  taskEl.id = `t-${id}`;

  const taskIdEl = document.createElement("div");
  taskIdEl.classList.add("id");
  taskIdEl.classList.add("tooltip");
  taskIdEl.innerHTML = `Task ...${id.slice(-4)} <span class="tooltiptext">${id}</span>`;

  const taskStatusEl = document.createElement("div");
  taskStatusEl.classList.add("status");
  taskStatusEl.classList.add(status.toLowerCase());
  taskStatusEl.textContent = status;

  taskEl.appendChild(taskIdEl);
  taskEl.appendChild(taskStatusEl);

  queueEl.appendChild(taskEl);
}

export function renderUpdatedTask(qId, data, {cancel}){

  const {id, task: status} = data;

  // Reset content
  const taskEl = document.querySelector(`#q-${qId} .q-list #t-${id}`);
  taskEl.innerHTML = "";


  const taskIdEl = document.createElement("div");
  taskIdEl.classList.add("id");
  taskIdEl.classList.add("tooltip");
  taskIdEl.innerHTML = `Task ...${id.slice(-4)} <span class="tooltiptext">${id}</span>`;

  const taskStatusEl = document.createElement("div");
  taskStatusEl.classList.add("status");
  taskStatusEl.classList.add(status.toLowerCase());
  taskStatusEl.textContent = status;

  taskEl.appendChild(taskIdEl);
  taskEl.appendChild(taskStatusEl);

  if(status === Status.RUNNING){

    const taskActionEl = document.createElement("button");
    taskActionEl.textContent = "cancel";
    taskActionEl.addEventListener("click", () => {
      cancel();
      console.log("called cancel")
    });
    taskEl.appendChild(taskActionEl);
  }
}