import Neocities from 'neocities';
import fs from 'fs';

// User and Pass for neocities, must be in object format for uploadToNeo function.
import { apiKey } from './pw.js';

function uploadToNeo(neoName, path) {
    const api = new Neocities(apiKey.user, apiKey.pass);

    api.upload([
        {name: neoName, path: path}
    ], (response) => {
        console.log(response)
    })
}

function readDist(realDir, neoDir = false) {
    fs.readdir(realDir, (err, files) => {
        files.forEach((ele, index) => {
            if (fs.lstatSync(`${realDir}/${ele}`).isDirectory()) {
                let curDir = neoDir === false ? `${ele}` : `/${neoDir}/${ele}`;

                readDist(`${realDir}/${ele}`, curDir);
            } else {
                neoDir === false ? uploadToNeo(ele, `${realDir}/${ele}`) : uploadToNeo(`/${neoDir}/${ele}`, `${realDir}/${ele}`);
            }
        })
    })
}

const initDir = './dist';
readDist(initDir);