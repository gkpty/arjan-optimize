var fs = require('fs')
var {copyFile, scanFolder} = require('./recurse')
var unusedCss = require('./unusedCss')
var compressImage =  require('./compressImages')

module.exports = async function index(){
  await main()
  .then(console.log("optimizing css . . ."))
  .then(console.log("compressing css . . ."))
  .then(console.log('All Done!'))
}

async function main(){
  let classes = {}
  return new Promise((resolve, reject) => {
    scanFolder("input/", async (filePath, stat) => {
      //inside our callback function 
      let fileSubPath = filePath.split('input/', 2)[1];
      let fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1);
      //let fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
      let stylesheets = []
      if(fileExtension =='html'){
          //use fs to read the contents of the file, edit and copy the file into the output folder
          var html = fs.readFileSync(filePath, 'utf8');
          //add classes to the classes object
          console.log('saving classes used in '+fileSubPath)
          await unusedCss.createClassList(html, classes)
          //resizeTumbnails
          //run arjanSeo
          //minify/compress
          //save to output
      }
      else if(fileExtension =='css'){
          //save the css file in stylesheets array
          stylesheets.push(filePath)
      }
      else if(fileExtension =='js'){
          console.log(`compressing ${fileSubPath} . . .`)
          //if the filsize is greater than x console.log(error)
          //compresss js file
          //save to output
      }
      else {
        await compressImage(filePath, (err, data) => {
          if(err) throw new Error(err)
          else{
            if(data) console.log('image compressed')
            else {
              console.log(`file format ${fileExtension} not recognized. Copying file as is.`)
              copyFile(fileSubPath)
            }
          }
        })     
      }    
    })
  }).then(console.log(classes))
}