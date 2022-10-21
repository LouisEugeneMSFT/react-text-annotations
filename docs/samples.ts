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

export const sampleLongText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum tristique metus, ac tristique massa vulputate et. Ut convallis massa vitae lorem interdum, quis posuere lectus convallis. Phasellus eros sapien, pulvinar at enim sit amet, dignissim tempus risus. Praesent scelerisque enim eget erat suscipit, vitae consectetur quam consequat. Curabitur molestie, augue at ultrices consectetur, nisl purus vulputate lacus, in semper justo odio at risus. Pellentesque ornare nec mauris a consectetur. In ut turpis sodales, hendrerit eros a, interdum libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In iaculis congue rutrum. Nam luctus posuere ligula sed iaculis. Etiam eu nulla non velit porttitor sodales fringilla quis purus. Quisque ornare, nisl ac bibendum rhoncus, dolor lacus dignissim nisi, vel iaculis ipsum libero vel eros. Curabitur ullamcorper sem non placerat vestibulum.

Duis vulputate malesuada erat sed gravida. Nulla odio eros, venenatis non sem vel, rhoncus laoreet ligula. Sed vitae vestibulum ante. Suspendisse ex odio, laoreet eu tortor eu, ornare viverra tortor. Mauris malesuada convallis sem, nec pulvinar metus fringilla vel. Proin mollis tincidunt ultricies. Vestibulum vitae massa vel velit dignissim condimentum in nec nisi. Integer venenatis urna id urna ornare pharetra. Integer mattis, purus sit amet euismod porttitor, urna tortor ultricies ante, quis scelerisque eros lorem id lectus. Etiam consectetur eu mi eget interdum. Nam aliquam risus in elit pharetra, sit amet sollicitudin diam mollis. Duis at porta justo.

Aenean eu odio urna. In tristique ipsum a tristique congue. Nulla nec ligula sit amet ex semper fringilla. Duis urna diam, imperdiet faucibus consectetur molestie, feugiat sed lectus. Aenean efficitur auctor ex ut dictum. Nunc vitae faucibus felis, sit amet luctus mi. Fusce eget lacus euismod, pellentesque sem sed, tincidunt massa. Mauris auctor varius purus ut maximus. Maecenas faucibus mauris eget sem porttitor faucibus. Donec fermentum eget mauris at condimentum. Curabitur pharetra euismod auctor. Donec mattis posuere dolor, sed facilisis dolor condimentum non. Ut semper, elit nec eleifend egestas, risus nunc gravida nulla, non condimentum eros felis ut nulla.

Proin euismod neque nec nisi lacinia eleifend. Aenean quis nibh eu sem egestas laoreet vel ut ex. Vivamus sit amet lectus sed eros fringilla mollis vel sit amet diam. Maecenas pulvinar vestibulum elit vel malesuada. In hac habitasse platea dictumst. Vestibulum sit amet semper risus, nec pharetra sapien. Integer vel sapien dignissim, tristique urna ut, accumsan libero. Suspendisse at pellentesque dolor. Donec consectetur sit amet ipsum nec fermentum. Sed vel mauris sed libero imperdiet blandit.

Donec vulputate mauris at nibh tincidunt, id eleifend ipsum iaculis. Cras mi lectus, iaculis volutpat lobortis in, cursus ac justo. Morbi nec tincidunt odio. Praesent neque enim, hendrerit in convallis nec, finibus quis enim. Nullam non tristique ex. Pellentesque id pretium mauris. Phasellus gravida, quam eu ultrices tempor, justo augue tincidunt tellus, eget tempus nisi turpis at nisi. Ut ut mauris quis mauris sagittis posuere sit amet eget sem. Duis nulla lorem, maximus in luctus ac, fringilla volutpat mi. Maecenas ac ultricies magna. Duis nec lectus quis lectus faucibus ultricies.`;

export const sampleLongTextAnnotations = [
  {
    key: "label",
    name: "Sample label",
    values: [
      { start: 2773, end: 2778 },
      { start: 2273, end: 2278 },
    ],
  },
];
