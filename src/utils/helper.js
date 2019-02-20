export function generateTestUrl(testId) {
  return document.location.origin + '/#/two-website-comparsion/' + testId;
}

export function getReadableRunName(runState) {
  switch (runState) {
    case "waiting": {
      return "queued...";
    }
    case "running": {
      return "running...";
    }
    case "idle": {
      return "idle";
    }
    case "error": {
      return "Opps, something happend at run";
    }

    default:
      return "Unknown state";
  }
}

// If Integer.isNumber is not defined (ex. IE), let's define it.
Number.isInteger = Number.isInteger || function (Integer) {
  return typeof Integer==='number' && (Integer%1)===0;
};


export const diffEngines = [
  {
    name: "Phantom Js",
    code: "phantomjs",
  },
  {
    name: "Slimer Js",
    code: "slimerjs",
  }
];

export const sourceId = Math.floor(Math.random() * 10000);
