const {app,BrowserWindow,session,shell,systemPreferences}=require('electron');
const http=require('http'),fs=require('fs'),path=require('path');
let server;
// Tiny local server so the page runs on http://127.0.0.1 (a secure origin for the camera)
function startServer(){return new Promise(ok=>{
  server=http.createServer((req,res)=>{
    fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{
      if(e){res.writeHead(500);return res.end('Cannot read index.html')}
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(d)})
  }).listen(0,'127.0.0.1',()=>ok(server.address().port))})}
async function createWindow(){
  const port=await startServer(),origin=`http://127.0.0.1:${port}`;
  const ses=session.defaultSession;
  // Allow camera only for our own page
  ses.setPermissionRequestHandler((wc,perm,cb)=>cb(perm==='media'&&wc.getURL().startsWith(origin)));
  ses.setPermissionCheckHandler((wc,perm)=>perm==='media');
  if(process.platform==='darwin')await systemPreferences.askForMediaAccess('camera').catch(()=>{});
  const win=new BrowserWindow({width:1360,height:860,minWidth:380,minHeight:600,backgroundColor:'#07060f',title:'MoodLens AI',autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
  win.loadURL(origin+'/');
  win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
}
app.whenReady().then(createWindow);
app.on('window-all-closed',()=>{if(server)server.close();app.quit()});
