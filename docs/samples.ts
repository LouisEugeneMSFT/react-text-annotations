export const sampleText =
  "Woman in NAD with h/o CAD, MD2, asthma and HTN on rampil for 8 years awoke from sleep around 2:30am this morning of a sore throat and swelling of tongue.";

export const sampleAnnotations = [
  {
    key: "diagnosis",
    name: "Diagnosis",
    values: [
      { start: 9, end: 12 },
      { start: 22, end: 25 },
      { start: 27, end: 30 },
      { start: 32, end: 38 },
      { start: 43, end: 46 },
    ],
  },
  {
    key: "time",
    name: "Time",
    values: [
      { start: 61, end: 68 },
      { start: 93, end: 112 },
    ],
  },
  {
    key: "medication_name",
    name: "Medication name",
    values: [{ start: 50, end: 56 }],
  },
  {
    key: "symptom_or_sign",
    name: "Symptom or sign",
    values: [
      { start: 118, end: 129 },
      { start: 134, end: 152 },
    ],
  },
];

export const sampleRelations = [
  {
    key: "time_of",
    name: "Time of",
    values: [
      { fromStart: 50, fromEnd: 56, toStart: 61, toEnd: 68 },
      { fromStart: 93, fromEnd: 112, toStart: 118, toEnd: 129 },
    ],
    directional: true,
  },
];
