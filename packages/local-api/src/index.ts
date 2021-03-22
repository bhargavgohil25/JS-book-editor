import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells'

export const serve = (port: number, filename: string, dir: string , useProxy: boolean) => {
  const app = express(); 
  
  app.use(createCellsRouter(filename,dir));
  
  if(useProxy){
      //! This below method will be used when we want active development like... like when we are testing the app and seeing updates the updates on a fly.
      app.use(createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true, 
      logLevel: 'silent', 
    }))
  }else{
    //! And this method will be used to run the app when it is installed from the npm packages or in production mode
    const packagePath = require.resolve('@js-book/local-client/build/index.html'); // require .resolve willl give us the actual path on our machine...
    app.use(express.static(path.dirname(packagePath))); // this is done to send the build foldr from local-client to local api but it won't work when we add in npm packages...
  }
  
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  })
};

