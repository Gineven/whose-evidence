// Values transcribed from the current manuscript. No generated or placeholder scores.
window.PAPER_DATA = {
  benchmark: [
    ["Co-grounding", "CVPR ’21", 10.24,21.66,6.11,11.17,16.29,8.40],
    ["DCNet", "ACM MM ’22", 11.65,23.58,8.79,13.10,17.64,9.21],
    ["TubeDETR", "CVPR ’22", 22.60,32.91,20.49,23.84,29.69,22.00],
    ["STCAT", "NeurIPS ’22", 24.14,35.51,22.48,27.17,33.39,25.36],
    ["SGFDN", "ACM MM ’23", 20.13,28.16,15.47,19.13,22.71,17.39],
    ["CG-STVG", "CVPR ’24", 21.23,28.82,19.04,22.32,26.24,20.41],
    ["VideoGrounding-DINO", "CVPR ’24", 23.83,33.84,19.92,25.80,31.72,23.00],
    ["SAVG-DETR", "NeurIPS ’25", 27.15,38.18,22.85,28.82,35.85,26.55],
    ["Video RSVG-ZeroOV ‡", "arXiv ’26", 27.19,35.62,29.28,33.77,37.87,34.61],
    ["TA-STVG †", "ICLR ’25", 27.00,37.50,25.35,28.90,35.61,27.82],
    ["STCAT †", "NeurIPS ’22", 28.57,40.55,25.90,30.44,37.74,29.06],
    ["Ours", "", 40.93,55.67,43.21,47.82,57.56,47.67]
  ],
  controls: [
    ["Frontend-only (top-conf.)",31.29,34.09,30.94],
    ["Local-only",33.45,38.27,31.18],
    ["STCAT + adapted GDINO",32.13,35.63,31.02],
    ["Unscoped readout",38.61,45.26,34.17],
    ["Ours",40.93,47.82,38.07]
  ],
  scale: {
    labels:["<0.1%","[0.1%, 0.5%)","[0.5%, 1%)","≥1%"],
    queries:[1110,875,145,785],
    mfacc: { label:"m_fAcc",stcat:[11.71,26.62,30.90,61.08],ours:[30.57,48.90,47.47,71.07] },
    mviou: { label:"m_vIoU",stcat:[13.60,24.79,30.41,53.60],ours:[25.67,39.95,40.46,63.70] }
  },
  vidstg: [
    ["All","STCAT",23.69,33.81,18.16,20.82],
    ["All","Ours",29.34,39.21,25.84,27.80],
    ["Declarative","STCAT",29.24,43.80,25.01,28.27],
    ["Declarative","Ours",32.35,43.72,30.07,32.09],
    ["Interrogative","STCAT",19.19,25.72,12.61,14.78],
    ["Interrogative","Ours",26.90,35.55,22.43,24.34]
  ],
  tnl2k: [
    {label:"Direct sampled-frame evaluation",rows:[["STCAT",24.68,33.86,13.57,23.13,29.86,16.14],["Ours",40.07,58.71,36.43,43.17,60.00,40.00]]},
    {label:"Dense evaluation with shared interpolation",rows:[["STCAT",23.60,32.14,12.43,21.46,26.43,15.43],["Ours",36.99,54.14,31.86,39.29,54.14,35.86]]}
  ],
  ablations: [
    ["Full",40.93,47.82,38.07],
    ["Hard top-1 association",40.12,46.39,35.49],
    ["Without unmatched null sink",39.46,46.73,36.28],
    ["Fixed fusion coefficient",38.37,46.02,35.86],
    ["Association score only (E-only)",37.83,44.39,32.94],
    ["Cue compatibility only (V-only)",39.45,45.82,35.39]
  ],
  efficiency: [
    ["STCAT †",28.57,23.95,583.45,1.152],
    ["Local-only",33.45,31.18,1589.06,1.306],
    ["STCAT + adapted GDINO",32.13,31.02,1669.47,1.963],
    ["Ours · R = 64",40.72,37.29,1600.97,1.307],
    ["Ours · Full",40.93,38.07,1650.60,1.432]
  ]
};
