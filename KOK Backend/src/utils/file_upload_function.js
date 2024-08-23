const path = require('path');
const fs = require('fs');
const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './src/Images/ProfileImage/')
//     },
//     filename: function(req, file, cb) {
//         const random = Math.floor(Math.random() * 10000000);
//         let extArray = file.mimetype.split("/");
//         let extension = extArray[extArray.length - 1];
//         if (extension == "jpg" || extension == "jpeg" || extension == "png") {
//             cb(null, `${random}.${extension}`)
//         } else {
//             cb(null, "file formate not allow")
//         }
//     }
// })

// const upload = multer({ storage: storage })



// module.exports = {
//     upload
// }




// const path = require('path');
// const fs = require('fs');
// const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageToFolder = async (buffer, fileName, folderPath) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(folderPath, fileName);

        // Write the buffer to the file
        fs.writeFile(filePath, buffer, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(filePath);
            }
        });
    });
}



module.exports = {
    upload,
    uploadImageToFolder
}