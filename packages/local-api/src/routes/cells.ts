import express from 'express'
import fs from 'fs/promises'
import path from 'path';

// fs is the inbuild library in the Node.js... 
// It is used to create/Get the files from the hard drive of the users's machine;
interface Cell{
    id: string;
    content: string;
    type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
    
    const router = express.Router();

    router.use(express.json());

    const fullPath = path.join(dir, filename);

    router.get('/cells',async(req,res) => {
        try{
            // read The File
            const result  = await fs.readFile(fullPath, { encoding: 'utf-8' });
            res.send(JSON.parse(result)); 
        }catch(err){
            if(err.code === 'ENOENT'){
                // ADD code to create a file and add default cells
                await fs.writeFile(fullPath,'[]', 'utf-8');
                res.send([]);
            }else{
                throw err
            }
        }
        
        // if read throws an error 
        // Inspect the error, see if it says that the file 
        // Parse a list list of cells out of it
        // Send List of cells back to browser
    });
    
    router.post('/cells', async(req,res) => {
        // Take the list of cells fro the request object
        // Serialize them
        const { cells }: { cells: Cell[] } = req.body;

        // Write the cells in the file..
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

        res.send({ status: 'ok' });
    });

    return router;
}



