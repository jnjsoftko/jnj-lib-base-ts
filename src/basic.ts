/** jnj-lib-base/basic
 *
 * Description
 *   - Function library for Basic(Without Importing Package) Utilities
 *
 * Functions
 *   [X] Check
 *     - ping: module 사용가능한지 체크
 *     - isEmptyDict, isEmpty, isFalsy, isValidStr
 *   [X] FileTypes(Extensions)
 *   - srt:  SubRipText  동영상 자막용 데이터
 *   - tsv:  Tab-Separated Values  tab으로 분리된 테이블 형식 데이터
 *   - csv:  Comma-Separated Values  `comma`으로 분리된 테이블 형식 데이터
 *   [X] DataTypes
 *   - str:  String  문자열
 *   - strs:  Array of String  문자열 배열
 *   - arr:  Array  1차원 배열
 *   - arrs:  Array of Array  2차원 배열(테이블 형식 데이터)
 *       - `googlesheet`, `csv`에 사용
 *   - pair: [keys, vals]
 *   - pairs: [keys, valss], valss: array of vals
 *   - dict:  Dictionary  key: value 쌍으로 이루어진 데이터.
 *       - javascript `object`와 동일
 *   - dicts:  Array of Dictionary  dict 배열
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *   -
 *
 * References
 *   - https://script.google.com/home/projects/11fYg0iHuLvA42TB_spV9OLOgtT0AnKgdrT8S-3pDkBqCWItgeflggOhw/edit
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
// & Functions AREA
// &---------------------------------------------------------------------------
// * types
// type Str = string | undefined | null;

// * Test
/**
 * Ping(Test)
 */
const ping = () => "pong";

// * Check
/**
 * Check Dict Empty(`{}`)
 * @remarks
 *  - method1: _.isEmpty(obj)
 *  - method2: obj && Object.keys(obj).length === 0 && obj.constructor === Object
 *  -
 */
const isEmptyDict = (obj: any) => JSON.stringify(obj) === "{}";

/**
 * Check Empty Dict or Arr(`[]`)
 * @remarks
 */
const isEmpty = (v: any) => JSON.stringify(v) === "{}" || JSON.stringify(v) === "[]";

/**
 * Check Falsy
 * @remarks
 *  - method1: _falsey(v) || _.isEmpty(v)
 */
const isFalsy = (v: any) => {
  return v === false || v === undefined || v === null || Number.isNaN(v) || v === 0 || v.length === 0 || Object.keys(v).length === 0;
};

/**
 * Check String Valid
 * @remarks
 */
const isValidStr = (s: any) => {
  return !(s === null || s.trim() === "" || typeof s !== "string");
};

// * Convert Object
/**
 * Serialize NonPOJOs
 * @remarks
 */
const serializeNonPOJOs = (obj: any) => {
  return structuredClone(obj);
};

// * String
/**
 * Evaluate String including `${expression}`
 *
 * @example
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

/**
 * String From Any Data
 */
const strFromAny = (s: any) => (typeof s == "string" ? s.trim() : JSON.stringify(s));

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
 * @example
 * csv = `"a "," b","c"
 * "1","2","3"
 * "4","5","6"`
 * arrsFromCsv(csv)
 *  => [["a", "b", "c"], ["1","2","3"], ["4","5","6"]]
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
 * @example
 * csvFromArrs([["a", "b", "c"], ["1","2","3"], ["4","5","6"]])
 *  => `"a "," b","c"
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

// * Arr, Arrs, Pair, Pairs, Dict, Dicts
/**
 * Returns arr From arrs(array of array).
 *
 * @param arrs - source arrays
 * @param index - extracted target index(추출하고자 하는 배열의 index값)
 * @hasHeader - has header (bool)
 *
 * @example
 * arrFromArrs([[1, 2, 3], [4, 5, 6]], 1)
 *  => [2, 5]
 */
const arrFromArrs = (arrs: any[], index = 0, hasHeader = false) => {
  const arr = arrs.map((c) => c[index]);
  return hasHeader ? arr.slice(1) : arr;
};

/**
 * Pop Dict By Key
 * @param obj - dict
 * @param key - string
 *
 * @example
 * pop({'a': 1, 'b': 2}, 'a')
 *  => {'b': 2}
 */
const popDict = (obj: any, key: string) => {
  let val = obj[key];
  delete obj[key];
  return val;
};

/**
 * New Dict Keys(maps의 key들에 대해, 변경된 key 이름으로 dict 생성)
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param defaults - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - defaults에 없을 때의 default값
 *
 * @example
 * newKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' }, {'d1': ''})
 * => { a1: 1, c1: 3, d1: '' }
 */
const newKeys = (obj: Record<string, any>, maps: Record<string, string>, defaults: Record<string, any>, dfault = "") => {
  return Object.keys(maps).reduce(function (obj_, key) {
    obj_[maps[key]] = obj[key] ?? defaults[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

/**
 * Rename Dict Keys(obj의 key들에 대한 이름 변경(변경 되지 않은 것은 유지))
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 *
 * @example
 * renameKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' })
 * =>
 * { a1: 1, b: 2, c1: 3 }
 */
const renameKeys = (obj: Record<string, any>, maps: Record<string, string>) => {
  return Object.keys(obj).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key];
    return obj_;
  }, {} as Record<string, any>);
};

/**
 * Overwrite Dict Keys(newKeys(신규 key 추가) + rename(key 이름 변경))
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param defaults - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - defaults에 없을 때의 default값
 *
 * @example
 * overwriteKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' }, {'d1': ''})
 * =>
 *  { a1: 1, b: 2, c1: 3, d1: '' }
 */
const overwriteKeys = (obj: Record<string, any>, maps: Record<string, string>, defaults: Record<string, any>, dfault = "") => {
  return Object.keys({ ...obj, ...defaults }).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key] ?? defaults[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

/**
 * Update Dict Keys
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param defaults - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - defaults에 없을 때의 default값
 * @param method
 *  - new: maps의 key들로만 신규 생성
 *  - rename: obj의 key들에 대한 이름 변경(변경 되지 않은 것은 유지)
 *  - update: new + update(obj 이름 변경, 신규 key 추가)
 *
 * @example
 * const dict = { 'a': 1, 'b': 2, 'c': 3 }
 * const maps = { 'a': 'a1', 'c': 'c1', 'd': 'd1' }
 * const defaults = {'d1': ''}
 * const method = 'new' | 'rename' | 'update';
 * updateKeys(dict, maps, defaults, method)
 * =>
 * - { a1: 1, c1: 3, d1: '' } <= method = 'new'
 * - { a1: 1, b: 2, c1: 3 } <= method = 'rename'
 * - { a1: 1, b: 2, c1: 3, d1: '' } <= method = 'update'
 */
const updateKeys = (obj: Record<string, any>, maps: Record<string, string>, defaults: Record<string, any>, dfault = "", method = "new") => {
  let _obj = maps; // method: `new`
  switch (method.toLowerCase()) {
    case "rename":
      _obj = obj;
      break;
    case "update":
      _obj = { ...obj, ...defaults };
      break;
  }

  return Object.keys(_obj).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key] ?? defaults[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

/**
 * Arr From Dicts(Extract array By Key)
 * @param dicts - source dicts
 *
 * @example
 *  arrFromDicts([{'h1': 'v11', 'h1': 'v12'}, {'h1': 'v21', 'h1': 'v22'}], 'h1')
 *   => ['v11', 'v21']
 */
const arrFromDicts = (dicts: any[], key: string) => {
  return dicts.map((dict) => dict[key]);
};

/**
 * Returns Dict(object) From Pair(Keys, Vals)
 * @param keys - dict keys
 * @param vals - dict values
 *
 * @example
 * dictFromPair(['a', 'b'], [1, 2]))
 *  => {'a': 1, 'b': 2}
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
 * @param keys - dict keys
 * @param vals - array of values
 *
 * @example
 * dictFromPair(['a', 'b'], [[1, 2], [3,4]])
 *  => [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}]
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
 * @param obj - source dict
 * @example
 * arrsFromDict({'h1': 'v11', 'h1': 'v12'})
 *  => [['h1', 'h2'], ['v11', 'v12']]
 */
const arrsFromDict = (obj: any) => {
  if (obj === null || typeof obj !== "object") {
    return [];
  }
  return [Object.keys(obj), Object.values(obj)];
};

/**
 * Arrs From Dicts
 * @param dicts - source dicts
 * @param header - header로 사용할 key 배열(순서)
 *   - key 이름을 변경하는 maps를 적용하려면, 순서가 적용되지 않음
 *   - key 이름 변경은 arrsFromDicts 처리후 arrs[0] 배열값 변경
 * @param dfault - header에 dicts[0]에 없는 key가 있는 경우, default값
 * @example
 * arrsFromDicts([{'h1': 'v11', 'h2': 'v12', 'h3': 'v13'}, {'h1': 'v21', 'h2': 'v22', 'h3': 'v13'}], ['h3', 'h4', 'h1'])
 *  => [[ 'h3', 'h4', 'h1' ],[ 'v13', '_v_', 'v11' ],[ 'v13', '_v_', 'v21' ]]
 */
const arrsFromDicts = (dicts: any[], header: string[] = [], dfault = "") => {
  if (!dicts || dicts.length == 0) {
    return header;
  }
  if (!header || header.length == 0) {
    header = Object.keys(dicts[0]);
  }

  let arrs = [header];
  for (let row of dicts) {
    let content = [];
    for (let h of header) {
      content.push(row[h] ?? dfault);
    }
    arrs.push(content);
  }
  return arrs;
};

/**
 * Arrs Added Default Values
 * @param arrs - given arrs
 * @param defaults - added default values
 * @param isPush -
 *
 * @example
 *  arrsAddedDefaults([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']], {'h3': ''}, false)
 *  => [['h1', 'h2', 'h3'], ['v11', 'v12', ''], ['v21', 'v22', '']]
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
 * Dicts From Arrs
 * @param arrs - source arrs
 * @param maps - key mapping {'oldKey1': 'newKey1', ...}
 * @param dfault - arrs에 없는 key인 경우 default값
 * @example
 * dictsFromArrs([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']],  {'h1': '_h1', 'h3': '_h3', 'h2': '_h2'})
 *  => [{ _h1: 'v11', _h3: '', _h2: 'v12' }, { _h1: 'v21', _h3: '', _h2: 'v22' }]
 */
const dictsFromArrs = (arrs: any[][], maps: any = {}, dfault = "") => {
  let _header: any[] = arrs.shift()!;
  let header = _header;
  // if (!isEmpty(maps)) header = Object.keys(maps);
  if (JSON.stringify(maps) != "{}") {
    header = Object.keys(maps);
  }

  const indexMaps = header.map((h) => _header.indexOf(h));
  return arrs.map((arr) => {
    let dict: any = {};
    header.forEach((h: any, i: number) => {
      dict[maps[h] ?? h] = indexMaps[i] != -1 ? arr[indexMaps[i]] ?? dfault : dfault;
    });
    return dict;
  });
};

// /**
//  * Dicts From Arrs
//  *
//  * @example
//  * dictsFromArrs([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']])
//  *  => [{'h1': 'v11', 'h1': 'v12'}, {'h1': 'v21', 'h1': 'v22'}]
//  */
// const dictsFromArrs = (arrs: any[][]) => {
//   let header: any[] = arrs.shift()!;
//   return arrs.map(arr => {
//     let dict: any = {};
//     header.forEach((h: any, i: number) => {
//       dict[h] = arr[i];
//     });
//     return dict;
//   });
// };

/**
 * Swap Dict Key-Value
 *
 * @example
 * swapDict({a: 1, b: 2})
 * => {'1': 'a', '2': 'b'}
 */
const swapDict = (dict: any) => {
  let ret: any = {};
  for (let key in dict) {
    ret[dict[key]] = key;
  }
  return ret;
};

/**
 * Get Upsert Dicts
 * @param olds - 원본 dicts
 * @param news - 출력 dicts
 * @param keys - (동일여부) 비교 대상 keys
 *
 * @example
 * const olds = [{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}, {a: 4, b: 6, c: 9}]
 * const news = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}, {a: 4, b: 8, d: 10}]
 * const keys = ['a', 'b']
 * let upserts = getUpsertDicts(olds, news, keys)
 * => upserts
 * upserts.adds = [{a: 4, b: 8, d: 10}]  // dicts exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 8} is
 * upserts.dels = [{a: 4, b: 5, c: 6}]  // dicts not exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 5} is in `news`, but is not in `olds`
 * upserts.upds = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}]  // dicts exist in news, and exist in olds for keys['a', 'b']. {a: 1, b: 2}, {a: 4, b: 6} are in `news`, `olds`.
 */
function getUpsertDicts<T extends Record<string, any>>(olds: T[] = [], news: T[] = [], keys: (keyof T)[]) {
  const upserts = {
    adds: [] as T[],
    dels: [] as T[],
    upds: [] as T[],
  };

  // Check for adds and upds dicts
  news.forEach((newDict) => {
    const matchingOldDict = olds.find((oldDict) => keys.every((key) => newDict[key] === oldDict[key]));

    if (!matchingOldDict) {
      upserts.adds.push(newDict);
    } else if (!Object.entries(newDict).every(([key, value]) => matchingOldDict[key] === value)) {
      upserts.upds.push(newDict);
    }
  });

  // Check for dels dicts
  olds.forEach((oldDict) => {
    const matchingNewDict = news.find((newDict) => keys.every((key) => oldDict[key] === newDict[key]));

    if (!matchingNewDict) {
      upserts.dels.push(oldDict);
    }
  });

  return upserts;
}
// function getUpsertDicts(olds: any[], news: any[], keys: any[]) {
//   const upserts = {
//     adds: any[],
//     dels: any[],
//     upds: any[],
//   };

//   // Check for adds and upds dicts
//   news.forEach((newDict) => {
//     const matchingOldDict = olds.find((oldDict) => keys.every((key) => newDict[key] === oldDict[key]));

//     if (!matchingOldDict) {
//       upserts.adds.push(newDict);
//     } else if (!Object.entries(newDict).every(([key, value]) => matchingOldDict[key] === value)) {
//       upserts.upds.push(newDict);
//     }
//   });

//   // Check for dels dicts
//   olds.forEach((oldDict) => {
//     const matchingNewDict = news.find((newDict) => keys.every((key) => oldDict[key] === newDict[key]));

//     if (!matchingNewDict) {
//       upserts.dels.push(oldDict);
//     }
//   });

//   return upserts;
// }

/**
 * Remove Keys From Dict
 * @param dict - 원본 dict
 * @param keys - 제거할 keys
 *
 * @example
 * removeDictKeys({a: 1, b: 2, c: 3}, ['a', 'c'])
 * => {b: 2}
 */
const removeDictKeys = (dict: any, keys: any[]) => {
  for (let key of keys) {
    delete dict[key];
  }
  return dict;
};

// * Data / Time
/**
 * Convert date string to ko-KR(yyyy년 M월 d일 (요일))
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

// & Export AREA
// &---------------------------------------------------------------------------
export {
  ping, // test
  popDict, // pop for dictionary
  serializeNonPOJOs, // NonPOJO -> POJO(Plain Old Java Object) object
  // ? string
  evalStr, // Evaluate String including `${expression}`
  tsvFromSrt, // Convert SubRipText(`srt`) format string => Tab-Separated Values(`tsv`) format string
  srtFromTsv, // Convert Tab-Separated Values(`tsv`) => SubRipText(`srt`)
  arrsFromCsv, // Convert Comma-Separated Values(`csv`) => Array of Array(`arrs`)
  csvFromArrs, // arrs -> csv
  convertStr, // convert string format
  // ? arr, arrs, pair, pairs, dict, dicts
  arrFromArrs, // Returns arr From arrs(array of array)
  arrFromDicts, // Returns arr From dicts (extract values by key)
  dictFromPair, // Returns Dict(object) From Pair(Keys, Vals)
  dictsFromPairs, //Returns Dicts(objects) From Pairs(Keys, Valss)
  arrsFromDict, // Arrs From Dict
  arrsFromDicts, // Arrs From Dicts
  dictsFromArrs, //Dicts From Arrs
  arrsAddedDefaults, // Arrs Added Default Values
  swapDict, // Swap Dict Key-Value
  getUpsertDicts, // Get Upsert Dicts({adds: [], dels: [], upds: []})
  removeDictKeys, // Remove Keys From Dict
  //  ? date, time
  now,
  delay,
  sleep,
  sleepAsync,
};
