import { defineStore } from "pinia";
import { useEditorStore } from "src/store/editor";
import { useChartStore } from "src/store/chart";

import { storage } from "/app/dbdiagram-oss/web/src/firebase";
import { ref, listAll, uploadString, deleteObject, getDownloadURL } from "firebase/storage";

// import localforage from "localforage";

// const fs = localforage.createInstance({
//   name: "dbdiagram-oss",
//   storeName: "files"
// });

export const useFilesStore = defineStore("files", {
  state: () => ({
    saving: false,
    lastSave: 0,
    currentFile: "",
    files: []
  }),
  getters: {
    getFiles(state) {
      return state.files;
    },
    getCurrentFile(state) {
      return state.currentFile;
    }
  },
  actions: {
    // loadFileList() {
    //   console.log("loading file list");
    //   fs.keys()
    //     .then(keys => {
    //       this.files = keys;
    //     });
    // },
    // loadFile(fileName) {
    //   this.loadFileList();
    //   console.log("loading file", fileName);

    //   fs.getItem(fileName)
    //     .then(file => {
    //       if (file && file.source) {
    //         const fSource = file.source;
    //         const fChart = file.chart || {};

    //         const editor = useEditorStore();
    //         const chart = useChartStore();

    //         chart.load(fChart);
    //         editor.load({
    //           source: fSource
    //         });

    //         this.$patch({
    //           currentFile: fileName
    //         });

    //       }
    //     });
    // },
    // saveFile(fileName) {
    //   this.saving = true;
    //   if (!fileName) {
    //     fileName = this.currentFile;
    //   }
    //   if (!fileName) {
    //     const list = this.files;
    //     let i = 1;
    //     fileName = `Untitled (${i})`;

    //     while (list.indexOf(fileName) >= 0) {
    //       fileName = `Untitled (${i++})`;
    //     }
    //   }
    //   console.log("saving file", fileName);

    //   const editor = useEditorStore();
    //   const chart = useChartStore();

    //   const file = {
    //     ...editor.save,
    //     chart: chart.save
    //   };

    //   fs.setItem(fileName, JSON.parse(JSON.stringify(file))).then(() => {
    //     this.loadFileList();
    //     this.saving = false;
    //     this.lastSave = new Date();
    //     if (this.currentFile !== fileName) {
    //       this.$patch({
    //         currentFile: fileName
    //       });
    //     }
    //   });
    // },
    // deleteFile(fileName) {
    //   if (!fileName) return;
    //   fs.removeItem(fileName).then(() => {
    //     this.loadFileList();
    //   });
    // },
    // renameFile(newName) {
    //   const oldName = this.currentFile;
    //   this.saveFile(newName);
    //   if (oldName !== newName) {
    //     this.deleteFile(oldName);
    //     this.currentFile = newName;
    //   }
    //   this.loadFileList();
    // },



    newFile() {
      console.log("newFile");
      this.$patch({
        currentFile: undefined
      });

      const editor = useEditorStore();
      const chart = useChartStore();

      editor.$reset();
      chart.$reset();
      this.saveFileGCS();
    },
    loadFileListGCS(){
      console.log("loadFileListGCS");
      
      // Create a reference under which you want to list
      const listRef = ref(storage, 'dbdiagram-oss/');
      console.log("listing the files in the bucket");

      this.files=[];

      listAll(listRef).then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          
        });
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          this.files.push(itemRef.name.replace('.json',''));
        });
      }).catch((error) => {
        console.log("error");
        // Uh-oh, an error occurred!
      });

      console.log(this.files);

    },
    loadFileGCS(fileName) {
      console.log("loadFileGCS");
      if (fileName != 'undefined' & fileName != 'Untitled') {
        const storageRef = ref(storage,'dbdiagram-oss/'+fileName+'.json');
        console.log("loading file ", fileName);

        const editor = useEditorStore();
        const chart = useChartStore();

        getDownloadURL(storageRef)
          .then((url) => {
            // console.log("downloading file ", file);
            const xhr = new XMLHttpRequest();
            var file = '';

            xhr.responseType = 'text';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);

            xhr.onload = () => {
              if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                  file = xhr.response;

                  file = JSON.parse(file);

                  console.log("the file");
                  console.log(file);

                  const fSource = file.source || {};
                  const fChart = file.chart || {};
      
                  const editor = useEditorStore();
                  const chart = useChartStore();
      
                  chart.load(fChart);

                  editor.load({
                    source: fSource
                  });

                  this.$patch({
                    currentFile: fileName
                  });
                }
              }
            };

            xhr.send();
          })

      }
    },
    saveFileGCS(fileName) {
      console.log("saveFileGCS");

      const editor = useEditorStore();
      const chart = useChartStore();

      const file = {
        ...editor.save,
        chart: chart.save
      };

      // console.log("the file...");
      // console.log(JSON.parse(JSON.stringify(file)));

      const storageRef = ref(storage,'dbdiagram-oss/'+fileName+'.json');
      uploadString(storageRef, JSON.stringify(file)).then((snapshot)=>{console.log('string uploaded')});
      this.loadFileListGCS()
    },
    deleteFileGCS(fileName) {
      console.log("deleteFileGCS");
      if (!fileName) return;

      // Create a reference to the file to delete
      const file = ref(storage, 'dbdiagram-oss/'+fileName+'.json');

      // Delete the file
      deleteObject(file).then(() => {
        console.log("File deleted successfully");
        this.loadFileListGCS();
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
    },
    renameFileGCS(newName) {
      console.log("renameFileGCS");
      const oldName = this.currentFile;
      this.saveFileGCS(newName);
      if (oldName !== newName) {
        this.deleteFileGCS(oldName)
        this.currentFile = newName;
      }
      this.loadFileListGCS();
    },
  }
});
