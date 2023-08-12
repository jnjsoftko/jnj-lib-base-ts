/**
 * A library for Basic(Package Without Importing) Utility Functions
 *
 *
 * FileTypes(Extensions)
 *   - srt:  SubRipText  동영상 자막용 데이터
 *   - tsv:  Tab-Separated Values  tab으로 분리된 테이블 형식 데이터
 *   - csv:  Comma-Separated Values  `comma`으로 분리된 테이블 형식 데이터
 *
 * DataTypes
 *   - str:  String  문자열
 *   - strs:  Array of String  문자열 배열
 *   - arr:  Array  1차원 배열
 *   - arrs:  Array of Array  2차원 배열(테이블 형식 데이터)
 *   - dict:  Dictionary  key: value 쌍으로 이루어진 데이터
 *   - dicts:  Array of Dictionary  dict 배열
 *   - pair: [keys, vals]
 *   - pairs: [keys, valss], valss: array of vals
 */

// & test
/**
 * Ping(Test)
 */
const ping = () => "pong";

// & types
// type Str = string | undefined | null;

// & Deal with DataType
/**
 * Pop Dict By Key
 *
 * @param obj - dict
 * @param key - string
 *
 * @example
 * pop({'a': 1, 'b': 2}, 'a') => {'b': 2}
 */
const popDict = (obj: any, key: string) => {
  let val = obj[key];
  delete obj[key];
  return val;
};

// & isTruthy / isFalsy / isValidStr / isEmpty
// const isFalsy = (v: any) => {
//   return (v === false || v === undefined || v === null || Number.isNaN(v) || v === 0 || v.length === 0 || Object.keys(v).length === 0)
// }

// const isTruthy = (v: any) => {
//   return (v !== false && v !== undefined && v !== null && !Number.isNaN(v) && v !== 0 && v.length !== 0 && Object.keys(v).length !== 0)
// }

// const isValidStr = (val) => {
//   return !(val === null || val.trim() === '' || typeof val !== 'string');
// };

// const isEmpty = (val) => {
//   if (val === null) {
//     return true;
//   } else if (typeof val === 'string') {
//     return val.trim() === '';
//   } else if (Array.isArray(val)) {
//     return val.length === 0;
//   } else if (typeof val === 'object') {
//     return Object.keys(val).length === 0;
//   }
// };

// & Convert Object
const serializeNonPOJOs = (obj: any) => {
  return structuredClone(obj);
};

// & String
/**
 * Evaluate String including `${expression}`
 *
 * @expression
 * evalStr('https://www.a.com/pgno=${i}&test=${j+1}&test2=${k+3}&test3=${i+5}', { i: 5, j: 6, k:7 });
 * => 'https://www.a.com/pgno5&test=7&test2=10&test3=10'
 */
const evalStr = (str: string, values: any) => {
  const regex = /\${(.*?)}/g;
  return str.replace(regex, (match, expression) => {
    const code = `return ${expression}`;
    const value = new Function(...Object.keys(values), code)(...Object.values(values));
    return value;
  });
};

// & Convert Format of String
/**
 * Convert SubRipText(`srt`) format string => Tab-Separated Values(`tsv`) format string
 */
const tsvFromSrt = (str: string) => {
  return `\n${str}`
    .replace(/\r\n/g, "\n")
    .replace(/\n(\d+)\n+/g, "$1\t")
    .replace(/\n([^\d])/g, "\t$1");
};

/**
 * Convert Tab-Separated Values(`tsv`) => SubRipText(`srt`)
 */
const srtFromTsv = (str: string) => {
  return str.replace(/\r\n/g, "\n").replace(/\n/g, "\n\n").replace(/\t/g, "\n");
};

/**
 * Convert Comma-Separated Values(`csv`) => Array of Array(`arrs`)
 * @param csv - csv string
 * @param sep - csv seperator / default=','
 * @param hasQuote
 * @param newline
 *
 * @returns arrs
 *
 * @example
 * csv : `"a "," b","c"
 * "1","2","3"
 * "4","5","6"`
 * result: [["a", "b", "c"], ["1","2","3"], ["4","5","6"]]
 */
const arrsFromCsv = (csv: string, sep = ",", hasQuote = true, newline = "\n") => {
  const arrs = [];
  for (const line of csv.split(newline)) {
    if (hasQuote) {
      arrs.push(
        line
          .slice(1, -1)
          .split(`"${sep}"`)
          .map((s) => s.trim())
      );
    } else {
      arrs.push(line.split(sep).map((s) => s.trim()));
    }
  }
  return arrs;
};

/**
 * Array of Array(`arrs`) => Convert Comma-Separated Values(`csv`)
 * @param arrs -
 * @param sep - csv seperator / default=','
 * @param hasQuote
 * @param newline
 *
 * @returns csv - csv string
 *
 * @example
 * arrs : [["a", "b", "c"], ["1","2","3"], ["4","5","6"]]
 * result : `"a "," b","c"
 * "1","2","3"
 * "4","5","6"`
 */
const csvFromArrs = (arrs: any, sep = ",", hasQuote = true, newline = "\n") => {
  let str = "";
  for (const arr of arrs) {
    if (hasQuote) {
      str += `"${arr.join('"' + sep + '"')}"${newline}`;
    } else {
      str += `${arr.join(sep)}${newline}`;
    }
  }
  return str;
};

/**
 * Returns arr From arrs(array of array).
 *
 *
 * @param arrs - source arrays
 * @param index - extracted target index
 * @hasHeader - has header (bool)
 *
 * @example
 * ```
 * console.log(arrFromArrs([[1,2,3], [4,5,6]], 1))
 *
 * # result
 * [2, 5]
 * ```
 */
const arrFromArrs = (arrs: any[], index = 0, hasHeader = false) => {
  const arr = arrs.map((c) => c[index]);
  return hasHeader ? arr.slice(1) : arr;
};

/**
 * Arr From Dicts(Extract array By Key)
 *
 * @param dicts - source dicts
 *
 * @example
 *
 */
const arrFromDicts = (dicts: any[], key: string) => {
  return dicts.map((dict) => dict[key]);
};

/**
 * Returns Dict(object) From Pair(Keys, Vals)
 *
 *
 * @param keys - dict keys
 * @param vals - dict values
 *
 * @example
 * ```
 * console.log(dictFromPair(['a', 'b'], [1, 2]))
 *
 * # result
 * {'a': 1, 'b': 2}
 * ```
 */
const dictFromPair = (keys: any[], vals: any[]) => {
  return keys.reduce((dict, key, i) => {
    dict[key] = vals[i];
    return dict;
  }, {});
};

/**
 * Returns Dicts(objects) From Pairs(Keys, Valss)
 *
 * @param keys - dict keys
 * @param vals - array of values
 *
 * @example
 * ```
 * console.log(dictFromPair(['a', 'b'], [[1, 2], [3,4]]))
 *
 * # result
 * [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}]
 * ```
 */
const dictsFromPairs = (keys: any[], valss: any[][]) => {
  return valss.map((vals) =>
    keys.reduce((dict, key, i) => {
      dict[key] = vals[i];
      return dict;
    }, {})
  );
};

/**
 * Arrs From Dict
 *
 * @param dict - source dict
 *
 * @example
 *
 */
const arrsFromDict = (dct: any) => {
  if (dct === null || typeof dct !== "object") {
    return [];
  }
  const keys = Object.keys(dct);
  const values = Object.values(dct);
  return [keys, values];
};

/**
 * Arrs From Dicts
 *
 * @param dicts - source dicts
 *
 * @example
 *
 */
const arrsFromDicts = (dicts: any[]) => {
  const arrs = [];
  if (dicts === null || dicts.length === 0) {
    return [];
  }
  const keys = Object.keys(dicts[0]);
  arrs.push(keys);
  dicts.forEach((dict) => {
    const row = keys.map((key) => dict[key]);
    arrs.push(row);
  });
  return arrs;
};

/**
 * Arrs Added Default Values
 *
 * @param arrs - given arrs
 * @param defaults - added default values
 * @param isPush -
 *
 * @example
 *
 */
const arrsAddedDefaults = (arrs: any[], defaults = {}, isPush = false) => {
  const addKeys = Object.keys(defaults);
  const addVals = Object.values(defaults);
  if (isPush) {
    return arrs.map((arr, i) => (i === 0 ? [...arr, ...addKeys] : [...arr, ...addVals]));
  } else {
    return arrs.map((arr, i) => (i === 0 ? [...addKeys, ...arr] : [...addVals, ...arr]));
  }
};

/**
 * Main Converter
 * @remarks
 * format coverter(string, arrays, dicts)
 */
const convertStr = (data: string, srcType: string, dstType: string) => {
  // return tsvFromSrt(data);
  if (srcType == "srt" && dstType == "tsv") {
    return tsvFromSrt(data);
  } else if (srcType == "tsv" && dstType == "srt") {
    return srtFromTsv(data);
  }
};

// & Dict, Dicts
/**
 * Swap Dict Key-Value
 *
 * @example
 * swapDict({a: 1, b: 2})
 * =>{'1': 'a', '2': 'b'}
 */
function swapDict(dict: any) {
  var ret = {};
  for (var key in dict) {
    ret[dict[key]] = key;
  }
  return ret;
}

/**
 * Get Upsert Dicts
 *
 * @param olds - 원본 dicts
 * @param news - 출력 dicts
 * @param keys - (동일여부) 비교 대상 keys
 *
 * @example
 *
 * const olds = [{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}, {a: 4, b: 6, c: 9}]
 * const news = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}, {a: 4, b: 8, d: 10}]
 * const keys = ['a', 'b']
 * let upserts = getUpsertDicts(olds, news, keys)
 *
 * => upserts
 * upserts.adds = [{a: 4, b: 8, d: 10}]  // dicts exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 8} is
 * upserts.dels = [{a: 4, b: 5, c: 6}]  // dicts not exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 5} is in `news`, but is not in `olds`
 * upserts.upds = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}]  // dicts exist in news, and exist in olds for keys['a', 'b']. {a: 1, b: 2}, {a: 4, b: 6} are in `news`, `olds`.
 */
function getUpsertDicts(olds: any[], news: any[], keys: any[]) {
  const upserts = {
    adds: [],
    dels: [],
    upds: [],
  };

  // Check for adds and upds dicts
  news.forEach((newDict: any) => {
    const matchingOldDict = olds.find((oldDict) => keys.every((key) => newDict[key] === oldDict[key]));

    if (!matchingOldDict) {
      upserts.adds.push(newDict);
    } else if (!Object.entries(newDict).every(([key, value]) => matchingOldDict[key] === value)) {
      upserts.upds.push(newDict);
    }
  });

  // Check for dels dicts
  olds.forEach((oldDict: any) => {
    const matchingNewDict = news.find((newDict) => keys.every((key) => oldDict[key] === newDict[key]));

    if (!matchingNewDict) {
      upserts.dels.push(oldDict);
    }
  });

  return upserts;
}

/**
 * Remove Keys From Dict
 *
 * @param dict - 원본 dict
 * @param keys - 제거할 keys
 *
 * @example
 * let upserts = getUpsertDicts({a: 1, b: 2, c: 3}, ['a', 'c'])
 *
 * => {b: 2}
 */
function removeDictKeys(dict: any, keys: any[]) {
  for (let key of keys) {
    delete dict[key];
  }
  return dict;
}

// & Data / Time
/**
 * Convert date string to ko-KR(yyyy년 M월 d일 (요일))
 *
 * @param {string} dateStr The function to delay.
 * @example
 *
 * dateKo('2023-07-15')
 * => 2023년 7월 15일 (토)
 */
const dateKo = (dateStr: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(new Date(dateStr));

/**
 * Get Now Date Time ()
 *
 * @param {Object} options options
 *   - timeZone: default 'Asia/Seoul'
 *   - hour12: default false
 *   - format: 'basic'|'ko' default 'basic'
 * @returns {string} Returns detetime string.
 * @example
 *
 * now()
 * => 2023-07-16 14:27:37
 * now({format: 'ko'})
 * => 2023. 7. 16. (일) 14:28:57
 */
const now = (options: any) => {
  const timeZone = options?.timeZone ?? "Asia/Seoul";
  const hour12 = options?.hour12 ?? false;
  const format = options?.format ?? "basic"; // yyyy-MM-dd hh:mm:ss
  const date = new Date().toLocaleString("en-US", { timeZone, hour12 });
  let now = new Date(date).toISOString().replace(/T/, " ").replace(/\..+/, "");

  switch (format.toUpperCase()) {
    case "KO": // `2023년 7월 15일 (토) hh:mm:ss`
      const [dateStr, timeStr] = now.split(" ");
      now = `${dateKo(dateStr)} ${timeStr}`;
      break;
  }

  return now;
};

/**
 * #source: https://github.com/lodash/lodash/blob/master/delay.js
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * delay(text => console.log(text), 1000, 'later')
 * // => Logs 'later' after one second.
 */
const delay = (func: Function, wait: number, ...args: any) => {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }
  return setTimeout(func, +wait || 0, ...args);
};

/**
 * Sleep For Second
 * @param sec
 */
const sleep = (sec: number) => {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
};

/**
 * Sleep For `wait` milliseconds.
 *
 * @param {number} wait The number of milliseconds to delay invocation.
 * @example
 *
 * console.log(new Date())
 * await sleep(1000);
 * console.log(new Date())
 * // => Logs 'later' after one second.
 */
const sleepAsync = async (wait: number) => {
  await new Promise((resolve) => setTimeout(resolve, wait));
};

// & EXPORT
export {
  ping, // test
  popDict, // pop for dictionary
  serializeNonPOJOs, // NonPOJO -> POJO(Plain Old Java Object) object
  evalStr, // Evaluate String including `${expression}`
  tsvFromSrt, // Convert SubRipText(`srt`) format string => Tab-Separated Values(`tsv`) format string
  srtFromTsv, // Convert Tab-Separated Values(`tsv`) => SubRipText(`srt`)
  arrsFromCsv, // Convert Comma-Separated Values(`csv`) => Array of Array(`arrs`)
  csvFromArrs, // arrs -> csv
  arrFromArrs, // Returns arr From arrs(array of array)
  arrFromDicts, // Returns arr From dicts (extract values by key)
  dictFromPair, // Returns Dict(object) From Pair(Keys, Vals)
  dictsFromPairs, //Returns Dicts(objects) From Pairs(Keys, Valss)
  arrsFromDict, // Arrs From Dict
  arrsFromDicts, // Arrs From Dicts
  arrsAddedDefaults, // Arrs Added Default Values
  convertStr, // convert string format
  swapDict, // Swap Dict Key-Value
  getUpsertDicts, // Get Upsert Dicts({adds: [], dels: [], upds: []})
  removeDictKeys, // Remove Keys From Dict
  now,
  delay,
  sleep,
  sleepAsync,
};
