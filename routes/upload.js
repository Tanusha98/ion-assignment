const IncomingForm = require("formidable").IncomingForm;
const unrar = require("unrar");
const JSONStream = require("JSONStream");
var fs = require("fs");
const ThermoData = require("../models/thermo-data");

module.exports = function upload(req, res) {
  var form = new IncomingForm();

  // console.log("req", req);

  form.on("file", (field, file) => {
    // extract rar

    var archive = new unrar("C:/Users/Tavee/Downloads/THERM0001.rar");
    // archive.list(function (err, entries) {
    //   var stream = archive.stream('some_binary_entry'); // name of entry
    //   stream.on('error', console.error);
    //   stream.pipe(require('fs').createWriteStream('some-binary-file'));
    // });
    // archive = new Unrar('t.rar');
    // console.log("rar...",file.path)
    // console.log("arch..",archive._filepath)
    // archive.list(function(err, entries) {
    //   console.log("entriess...",entries);
    //   for (var i = 0; i < entries.length; i++) {
    //     var name = entries[i].name;
    //     var type = entries[i].type;
    //     if (type !== "File") {
    //       fs.mkdirSync(name);
    //     }
    //   }

    //   for (var i = 0; i < entries.length; i++) {
    //     var name = entries[i].name;
    //     var type = entries[i].type;
    //     if (type !== "File") {
    //       continue;
    //     }

    //     var stream = archive.stream(name);
    //     try {
    //       fs.writeFileSync(name, stream);
    //     } catch (e) {
    //       throw e;
    //     }
    //   }
    // });
    //   // const extractor = unrar.createExtractorFromData(data);
    //   // const list = extractor.getFileList();
    //   // console.log("list.. ", list);
    //   // if (list[0].state === "SUCCESS") {
    //   //   const fileNmes = list[1].fileHeaders.map(header => header.name);
    //   //   console.log("filenames... ", fileNmes);
    //   // }

    // to store json in database
    var arrayData = [];
    const dataStreamFromFile = fs.createReadStream(file.path);
    dataStreamFromFile.pipe(JSONStream.parse("*")).on("data", async data => {
      arrayData.push(data);
      if (arrayData.length === 10000) {
        dataStreamFromFile.pause();
        await ThermoData.insertMany(arrayData);
        arrayData = [];
        process.stdout.write(".");
        dataStreamFromFile.resume();
        console.log("batch done...");
      }
    });
    dataStreamFromFile.on("end", async () => {
      await ThermoData.insertMany(arrayData); // left over data
      console.log("/nImport complete, closing connection...");
      // process.exit(0);
    });
  });
  form.on("end", () => {
    console.log("end");
    console.log();
  });
  form.parse(req);
};
