import React, { PropsWithChildren } from "react";

interface PropsType {
  title: string;
  description: string;
  requirements?: string[];
  onRun: () => void;
}

function FlowRunner(props: PropsWithChildren<PropsType>) {
  return (
    <div className="item">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      {!!props.requirements && (
        <React.Fragment>
          <p>Requirements:</p>
          <ul>
            {props.requirements.map((text) => (
              <li>{text}</li>
            ))}
          </ul>
        </React.Fragment>
      )}
      <p>{props.children}</p>
      <div>
        <button onClick={props.onRun}>Run</button>
      </div>
    </div>
  );
}

export { FlowRunner };
