import { Manager } from "@rangodev/queue-manager-core";
import {
  renderQueue,
  renderTask,
  renderUpdatedQueueStatus,
  renderUpdatedTask,
} from "./renderer";
import {
  swapQueueDefinition,
} from "./flows/single";

console.log("%c [0] Let's go.", "background: #222; color: #bada55");
const manager = new Manager({
  events: {
    onCreateQueue: (q) => {
      renderQueue(q);
    },
    onUpdateQueue: (qId, q) => {
      const { status } = q;
      renderUpdatedQueueStatus(qId, status);
    },
    onCreateTask: (qId, task) => {
      renderTask(qId, task);
    },
    onUpdateTask: onUpdateTask,
  },
  queuesDefs: [swapQueueDefinition],
});

function onUpdateTask(qId, task){
  const cancel = () => {
    manager.get(qId)?.list.cancel();
  }
  renderUpdatedTask(qId, task, {
    cancel
  });
}

function runSingleWallet() {
  const qId = manager.create("swap", {});
  console.log(`A new queue has been added: ${qId}`, manager);
}

function runMultipleQueue() {
  const qId = manager.create("swap", {});
  const q2Id = manager.create("swap", {});
  console.log(`two new queues have been added: \n${qId} \n ${q2Id}`, manager);
}


document.getElementById("single")?.addEventListener("click", runSingleWallet);
document.getElementById("multiple")?.addEventListener("click", runMultipleQueue);
