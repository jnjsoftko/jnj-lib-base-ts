/** sqlPocketbase
 *
 * Description
 *   - A library for Buitin(Package With Buitin Importing) Utility Functions
 *
 * Functions
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *   -
 *
 * References
 *   -
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules
import * as fs from "fs";
import Path from "path";

// & Functions AREA
// &---------------------------------------------------------------------------
// * File System
/**
 * remove BOM(Byte Order Mark, `U+FEFF`)
 */
const removeBOM = (str: string) => {
  return str
    .replace(/^\uFEFF/gm, "")
    .replace(/^\u00BB\u00BF/gm, "")
    .replaceAll("\r\n", "\n");
};

/**
 * 폴더이름에 포함된 "\\" => "/"
 */
const slashedFolder = (folderName: string) => {
  folderName = folderName.replaceAll("\\", "/");
  return folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
};

/**
 * set Path(실행 경로 기준)
 */
const setPath = (path: string) => {
  if (path.startsWith(".")) {
    path = Path.join(process.cwd(), path);
  }
  return slashedFolder(path);
};

/**
 * Load data(string) from file with charset(encoding)
 */
const loadFile = (path: string, encoding: BufferEncoding = "utf8") => {
  try {
    return removeBOM(fs.readFileSync(setPath(path), { encoding }));
  } catch {
    return null;
  }
};

/**
 * Load data(json) from file with charset(encoding)
 */
const loadJson = (path: string, encoding: BufferEncoding = "utf8") => {
  try {
    return JSON.parse(removeBOM(fs.readFileSync(setPath(path), { encoding })));
  } catch {
    return null;
  }
};

/**
 * Save data to file with charset(encoding), create Folder if not exist
 * @remarks
 * if overwrite is false, append data to file
 */
const saveFile = (path: string, data = "", encoding: BufferEncoding = "utf-8", overwrite = true) => {
  path = setPath(path);
  fs.mkdirSync(Path.dirname(path), { recursive: true });
  overwrite ? fs.writeFileSync(path, data, encoding) : fs.appendFileSync(path, data, encoding);
};

/**
 * Save object(dict) to file with charset(encoding), create Folder if not exist
 * @remarks
 * # TODO : add `append` func
 */
const saveJson = (path: string, data = {}, indent = 2) => {
  saveFile(setPath(path), JSON.stringify(data, null, indent));
};

/**
 * make directory if path not exist
 */
const mkdir = (path: string) => {
  fs.mkdirSync(setPath(path), { recursive: true });
};

/**
 * copy fies in srcDir to dstDir recursively
 */
const cpdir = (srcDir: string, dstDir: string, recursive = true) => {
  fs.cpSync(setPath(srcDir), setPath(dstDir), { recursive });
};

/**
 * find All Files In Folder
 * @param folder
 */
const findFiles = (folder: string) => {
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);
};

/**
 * find All Files In Folder(Recursively)
 * @param folder
 * @param  arrayOfFiles
 */
const findFilesRecusive = (folder: string, arrayOfFiles: string[] = []) => {
  if (!fs.existsSync(folder)) return [];
  const files = fs.readdirSync(folder);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(folder + "/" + file).isDirectory()) {
      arrayOfFiles = findFilesRecusive(folder + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(Path.join(folder, "/", file));
    }
  });

  return arrayOfFiles;
};

// /**
//  * find Files In Folder
//  * @param folder
//  * @param  filterCb
//  * @param  mapCb
//  */
// const findFileList = (folder: string, filterCb: Function, mapCb: Function) => {
//   return fs
//     .readdirSync(folder)
//     .filter((name) => filterCb(name))
//     .map((name) => mapCb(name));
//   // return fs.readdirSync(`${process.env.ROOT_DIR}/${folder}`).filter((name)=> name.endsWith('.ts')).map((name) => `${folder}/${name}`);
// };

// base_path의 하위 폴더 중에 이름에 pattern을 포함하는 폴더
function findFolders(basePath: string, pattern: string = ""): string[] {
  const matchedFolders: string[] = [];
  // base_path 디렉토리 내의 모든 파일과 폴더를 순회합니다.
  for (const entry of fs.readdirSync(basePath)) {
    const fullPath = Path.join(basePath, entry);
    // 현재 엔트리가 폴더이고, 패턴을 포함한다면 리스트에 추가합니다.
    if (fs.statSync(fullPath).isDirectory() && entry.includes(pattern)) {
      matchedFolders.push(slashedFolder(fullPath));
    }
  }
  return matchedFolders;
}

/**
 * exists Folder(폴더 존재여부)
 */
const existsFolder = (folder: string) => fs.existsSync(folder);

// /**
//  * slashedFolder
//  * @param folderName
//  */
// const slashedFolder = (folderName: string) => {
//   folderName = folderName.replace("\\", "/").replace("//", "/");
//   return folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
// };

/**
 * moveFile
 */
const moveFile = (srcFolderName: string, dstFolderName: string, srcFileName: string, dstFileName: string) => {
  srcFolderName = slashedFolder(srcFolderName);
  dstFolderName = slashedFolder(dstFolderName);

  fs.rename(`${srcFolderName}/${srcFileName}`, `${dstFolderName}/${dstFileName}`, (err) => console.log(err));
};

/**
 * moveFiles
 */
const moveFiles = (srcFolderName: string, dstFolderName: string, srcFileNames: string[], dstFileNames: string[]) => {
  srcFolderName = slashedFolder(srcFolderName);
  dstFolderName = slashedFolder(dstFolderName);

  !fs.existsSync(dstFolderName) && fs.mkdirSync(dstFolderName, { recursive: true });
  for (let i = 0; i < srcFileNames.length; i++) {
    const srcFileName = srcFileNames[i];
    const dstFileName = dstFileNames[i];
    fs.rename(`${srcFolderName}/${srcFileName}`, `${dstFolderName}/${dstFileName}`, (err) => console.log(err));
  }
};

/**
 * rename Files In Folder
 * @param folder
 * @param  filterCb
 * @param  mapCb
 */
const renameFilesInFolder = (folder: string, filterCb: Function, mapCb: Function) => {
  folder = `${process.env.ROOT_DIR}/${folder}`;
  filterCb = (name: string) => name.endsWith(".ts");
  mapCb = (name: string) => `${folder}/${name}`;
  return fs
    .readdirSync(folder)
    .filter((name) => filterCb(name))
    .map((name) => mapCb(name));
  // return fs.readdirSync(`${process.env.ROOT_DIR}/${folder}`).filter((name)=> name.endsWith('.ts')).map((name) => `${folder}/${name}`);
};

// /**
//  * rename files In foler
//  */
// export const renameFile = (folderName: string) => {
//   // folderName = '_downloads/json/lectures';
//   const files = fs.readdirSync(folderName);

//   files.forEach(file => fs.rename(
//     folderName + `/${file}`,
//     folderName + `/web-design-figma-webflow-freelancing/${file.split('_').slice(-1)}`,
//     err => console.log(err)
//   ));
// }

// & Export AREA
// &---------------------------------------------------------------------------
export {
  removeBOM, // remove BOM(Byte Order Mark, `U+FEFF`)
  slashedFolder, //
  setPath, // 상대경로->절대경로(실행 폴더 기준) './dir1/dir2' =>
  loadFile, //
  loadJson, //
  saveFile, //
  saveJson, //
  mkdir, //
  cpdir, // 폴더 복사(recursive)
  findFiles, // 파일 목록
  findFilesRecusive, // 파일 목록(recursive)
  // findFileList, // 파일 목록(filter, map)
  findFolders, // 하위 folder 목록
  existsFolder, // 폴더 존재여부
  moveFile,
  moveFiles,
  // renameFilesInFolder
};

// & Test AREA
// &---------------------------------------------------------------------------
// const slashedFolder = (folderName: string) => {
//   folderName = folderName.replaceAll("\\", "/");
//   return folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
// };

// // console.log(slashedFolder("C:\\JnJ-soft\\Playground\\chrome-ts\\node_modules/"));

// const folderName = "C:\\JnJ-soft\\Playground\\chrome-ts\\node_modules";
// console.log(folderName.replaceAll("\\", "/"));

// const folders = findFolders("C:\\JnJ-soft\\Playground\\chrome-ts");
// console.log(folders);
