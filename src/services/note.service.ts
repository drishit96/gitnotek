import {
  status,
  add,
  clone,
  commit,
  push,
  pull,
  init,
  PushResult,
  listRemotes,
  addRemote,
  remove,
  statusMatrix,
  deleteRemote,
} from "isomorphic-git";
import FS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import { authService } from "./auth.service";
import { Note } from "src/Components/Note";
import { commonService } from "./common.service";
const fs = new FS("fs");

const ROOT_DIR = "/gitnotek-notes";
const CORS_PROXY = "https://cors.isomorphic-git.org";

export const noteService = {
  lastSync: Date.now() - 600000,
  getLastSync() {
    return this.lastSync;
  },

  setLastSync(lastSync: number) {
    this.lastSync = lastSync;
  },

  async isRemoteSet() {
    try {
      let remotes = await listRemotes({ fs, dir: ROOT_DIR });
      return !!remotes.length;
    } catch (error) {
      return false;
    }
  },

  async getRemote() {
    try {
      let remotes = await listRemotes({ fs, dir: ROOT_DIR });
      if (remotes?.length) {
        return remotes[0].url;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  async setRemote(url: string) {
    try {
      let remotes = await listRemotes({ fs, dir: ROOT_DIR });
      const isRemoteAdded = remotes.some((remote) => remote.url === url);
      if (!isRemoteAdded) {
        await addRemote({
          fs,
          dir: ROOT_DIR,
          remote: "origin",
          url,
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  async deleteAllRemotes() {
    try {
      const remotes = await listRemotes({ fs, dir: ROOT_DIR });
      let promises: Promise<void>[] = [];
      remotes.forEach((remote) => {
        promises.push(
          deleteRemote({ fs, dir: ROOT_DIR, remote: remote.remote })
        );
      });
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async deleteDb() {
    try {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase("fs");
        request.addEventListener("success", () => {
          console.log("Database deleted");
          resolve(true);
        });
        request.addEventListener("error", () => reject("Delete db failed"));
      });
    } catch (error) {
      console.log(error);
      return Promise.resolve(false);
    }
  },

  async commitAndPush(commitMsg: string) {
    try {
      await commit({
        fs,
        dir: ROOT_DIR,
        author: {
          name: "Gitnotek",
          email: "gitnotek@gmail.com",
        },
        message: commitMsg,
      });

      let pushResult: PushResult = { ok: false, error: "", refs: {} };
      let remotes = await listRemotes({ fs, dir: ROOT_DIR });
      if (remotes.length) {
        pushResult = await push({
          fs,
          http,
          dir: ROOT_DIR,
          remote: "origin",
          corsProxy: CORS_PROXY,
          onAuth: () => {
            const auth = authService.lookupSavedAuth();
            if (auth) return auth;
            else return { cancel: true };
          },
        });
      }

      return pushResult.ok;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async cloneRepository(
    url: string,
    userName: string,
    branchName: string,
    isTokenRequired: boolean
  ) {
    try {
      try {
        await this.deleteDb();
        await fs.promises.mkdir(ROOT_DIR);
      } catch (error) {}

      const [domainWithUsernamePassword, domainName] =
        commonService.extractDomainFromUrl(url);

      if (isTokenRequired) {
        url = url.replace(
          domainWithUsernamePassword !== domainName
            ? domainWithUsernamePassword
            : domainName,
          `${userName}:${authService.getAuthTko()}@${domainName}`
        );
      }

      if (!url.endsWith(".git")) {
        url = url + ".git";
      }

      await clone({
        fs,
        http,
        dir: ROOT_DIR,
        url,
        corsProxy: CORS_PROXY,
        depth: 10,
        ref: branchName,
        onAuth: () => {
          let auth = authService.lookupSavedAuth();
          if (auth) return auth;
          return { cancel: true };
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  async createRepository(name: string) {
    try {
      const response = await fetch("/api/v1/createRepository", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      });

      if (response.status === 201) return true;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  removeSlashesFromEnd(directory: string): string {
    if (directory[directory.length - 1] !== "/") {
      return directory;
    } else {
      return this.removeSlashesFromEnd(
        directory.substring(0, directory.length - 1)
      );
    }
  },

  async saveNote(directory: string, title: string, content: string) {
    try {
      directory = this.removeSlashesFromEnd(directory);
      const path = directory ? `${ROOT_DIR}/${directory}/` : `${ROOT_DIR}/`;
      try {
        await fs.promises.mkdir(path);
      } catch (error) {}

      await fs.promises.writeFile(`${path}${title}.md`, content);
      await add({
        fs,
        dir: ROOT_DIR,
        filepath: directory ? `${directory}/${title}.md` : `${title}.md`,
      });
      console.log(
        await status({
          fs,
          dir: path,
          filepath: directory ? `${directory}/${title}.md` : `${title}.md`,
        })
      );
      console.log(await fs.promises.readdir(path));
      const isPushed = this.commitAndPush(`Update ${title}`);
      return isPushed;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async saveImage(fileName: string, image: string | ArrayBuffer) {
    try {
      const path = `${ROOT_DIR}/.gitnotek-images/`;
      try {
        await fs.promises.mkdir(path);
      } catch (error) {}

      await fs.promises.writeFile(`${path}${fileName}`, image);
      await add({
        fs,
        dir: ROOT_DIR,
        filepath: `.gitnotek-images/${fileName}`,
      });
      console.log(
        await status({
          fs,
          dir: path,
          filepath: `.gitnotek-images/${fileName}`,
        })
      );
      console.log(await fs.promises.readdir(path));
      const isPushed = this.commitAndPush(`Upload image: ${fileName}`);
      return isPushed;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async setObjectNameType(
    object: string,
    directory: string,
    nameTypeMap: Map<string, boolean>
  ) {
    try {
      const stats = await fs.promises.stat(
        directory
          ? `${ROOT_DIR}/${directory}/${object}`
          : `${ROOT_DIR}/${object}`
      );
      nameTypeMap.set(object, stats.isFile());
    } catch (error) {
      console.log(error);
    }
  },

  async getObjectNameTypeMap(objects: string[], directory: string) {
    const nameTypeMap = new Map<string, boolean>();
    let asyncCalls = [];
    for (const object of objects) {
      asyncCalls.push(this.setObjectNameType(object, directory, nameTypeMap));
    }

    await Promise.all(asyncCalls);
    return nameTypeMap;
  },

  async getNotes(directory?: string) {
    try {
      const path = `${ROOT_DIR}/${directory ?? ""}`;
      let objects: string[] = [];
      try {
        objects = await fs.promises.readdir(path);
      } catch (error) {
        console.log(error);
        if (!directory) {
          await init({ fs, dir: ROOT_DIR, defaultBranch: "main", bare: false });

          objects = await fs.promises.readdir(ROOT_DIR);
        }
      }
      objects = objects.filter((obj) => obj.charAt(0) !== ".");
      const notes: Note[] = [];
      const objectNameTypeMap = await this.getObjectNameTypeMap(
        objects,
        directory ?? ""
      );
      objects.forEach((item) => {
        notes.push({
          id: item,
          content: item,
          isFile: objectNameTypeMap.get(item) ?? false,
        });
      });

      notes.sort((a, _) => (a.isFile ? 1 : -1));
      return notes;
    } catch (error) {
      return [];
    }
  },

  async getNoteContent(path: string) {
    try {
      const content = await fs.promises.readFile(`${ROOT_DIR}/${path}.md`);
      return content ? new TextDecoder("utf-8").decode(content) : "";
    } catch (error) {
      return "";
    }
  },

  async syncNotesWithRemote() {
    await pull({
      fs,
      http,
      dir: ROOT_DIR,
      ref: "main",
      singleBranch: true,
      author: {
        name: "Gitnotek",
        email: "gitnotek@gmail.com",
      },
      onAuth: () => {
        const auth = authService.lookupSavedAuth();
        if (auth) return auth;
        else return { cancel: true };
      },
    });
    console.log(await fs.promises.readdir(ROOT_DIR));
  },

  async getUnstagedFiles() {
    const FILE = 0,
      WORKDIR = 2,
      STAGE = 3;

    return (await statusMatrix({ fs, dir: ROOT_DIR }))
      .filter((row) => row[WORKDIR] !== row[STAGE])
      .map((row) => row[FILE]);
  },

  async stageAllFiles() {
    const repo = { fs, dir: ROOT_DIR };
    await statusMatrix(repo).then((status) =>
      Promise.all(
        status.map(([filepath, , worktreeStatus]) =>
          worktreeStatus
            ? add({ ...repo, filepath })
            : remove({ ...repo, filepath })
        )
      )
    );
  },

  async deleteRecursively(directory: string) {
    const objects: string[] = await fs.promises.readdir(
      `${ROOT_DIR}/` + directory
    );
    const objectNameTypeMap = await this.getObjectNameTypeMap(
      objects,
      directory
    );

    let promises = [];
    for (const object of objects) {
      if (objectNameTypeMap.get(object) ?? false) {
        console.log(`Deleting ${`${ROOT_DIR}/` + directory + "/" + object}`);
        promises.push(
          fs.promises.unlink(`${ROOT_DIR}/` + directory + "/" + object)
        );
      } else {
        promises.push(this.deleteRecursively(directory + "/" + object));
      }
    }

    await Promise.all(promises);
    console.log(`Deleting: ${`${ROOT_DIR}/` + directory}`);
    await fs.promises.rmdir(`${ROOT_DIR}/` + directory);
  },

  async deleteNotes(
    itemsToDelete: { name: string; isFile: boolean }[],
    directory?: string
  ) {
    const basePath = `${ROOT_DIR}/${directory ?? ""}${directory ? "/" : ""}`;
    let promises = [];
    for (const item of itemsToDelete) {
      if (item.isFile) {
        promises.push(fs.promises.unlink(basePath + item.name));
        promises.push(
          remove({
            fs,
            dir: ROOT_DIR,
            filepath: basePath + item.name,
          })
        );
      } else {
        promises.push(
          this.deleteRecursively((directory ? `${directory}/` : "") + item.name)
        );
      }
    }
    await Promise.all(promises);
    if (itemsToDelete.length) {
      await this.stageAllFiles();
      await this.commitAndPush("Delete notes");
    }

    return itemsToDelete.length;
  },

  async createFolder(path: string, folderName: string) {
    if (!folderName) throw new Error("INVALID");
    const fullPath = `${ROOT_DIR}/${path ? `${path}/` : ""}${folderName}/`;
    await fs.promises.mkdir(fullPath);
  },
};
