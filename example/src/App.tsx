import React, { useState } from "react";
import { Annotations, Relations } from "../../src/Annotator/types";
import { Annotator } from "../../src/index";

const sampleText = `Woman in NAD with h/o CAD, MD2, asthma and HTN on rampil for 8 years awoke from sleep around 2:30am this morning of a sore throat and swelling of tongue.`;

const sampleAnnotations: Annotations = [
  {
    key: "Diagnosis",
    values: [
      { start: 9, end: 12 },
      { start: 22, end: 25 },
      { start: 27, end: 30 },
      { start: 32, end: 38 },
      { start: 43, end: 46 },
    ],
  },
  {
    key: "Time",
    values: [
      { start: 61, end: 68 },
      { start: 93, end: 112 },
    ],
  },
  {
    key: "Medication name",
    values: [{ start: 50, end: 56 }],
  },
  {
    key: "Symptom or sign",
    values: [
      { start: 118, end: 129 },
      { start: 134, end: 152 },
    ],
  },
];

const sampleRelations: Relations = [
  {
    key: "Time of",
    values: [
      { fromStart: 50, fromEnd: 56, toStart: 61, toEnd: 68 },
      { fromStart: 93, fromEnd: 112, toStart: 118, toEnd: 129 },
    ],
    directional: true,
  },
];

function App() {
  const [annotations, setAnnotations] = useState(sampleAnnotations);
  const [relations, setRelations] = useState(sampleRelations);

  return (
    <div style={{ padding: 40 }}>
      <Annotator
        text={sampleText}
        annotations={annotations}
        relations={relations}
        onChangeAnnotations={setAnnotations}
        onChangeRelations={setRelations}
        uiOptions={{ fontSize: 22 }}
      />
    </div>
  );
}

export default App;
