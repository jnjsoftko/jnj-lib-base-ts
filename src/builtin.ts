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
 * set Path(실행 경로 기준)
 */
const setPath = (path: string) => {
  if (path.startsWith(".")) {
    path = Path.join(process.cwd(), path);
  }
  return path;
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
  // renameFilesInFolder
};
