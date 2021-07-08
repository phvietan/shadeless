export type paramReflect = {
  value: string;
  reflected: boolean;
}

function checkLarger (a: string, b: string) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

export function parseParameterAndReflected (parameters: string[], reflectedParameters: string[]): paramReflect[] {
  parameters.sort();
  reflectedParameters.sort();

  const result: paramReflect[] = [];
  let i = 0;
  let j = 0;
  while (i < parameters.length) {
    if (j === reflectedParameters.length) {
      result.push({
        value: parameters[i],
        reflected: false,
      });
      i += 1;
      continue;
    }
    if (parameters[i] === reflectedParameters[j]) {
      result.push({
        value: parameters[i],
        reflected: true,
      });
      i += 1;
      j += 1;
    } else if (parameters[i] < reflectedParameters[j]) {
      result.push({
        value: parameters[i],
        reflected: false,
      });
      i += 1;
    } else {
      j += 1;
    }
  }
  result.sort((a, b): number => {
    if (a.reflected && b.reflected) return checkLarger(a.value, b.value);
    if (a.reflected) return -1;
    if (b.reflected) return 1;
    return checkLarger(a.value, b.value);
  });
  return result;
}
