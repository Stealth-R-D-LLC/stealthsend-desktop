const { ipcRenderer, contextBridge } = require( 'electron' )
contextBridge.exposeInMainWorld(
    'ipc', {
        send: ( channel, ...args ) => {
            ipcRenderer.send( channel, ...args )
        },
        // invoke: ( channel, ...args ) => {
        //     return ipcRenderer.invoke( channel, ...args )
        // },
        // sendSync: ( channel, ...args ) => {
        //     return ipcRenderer.sendSync( channel, ...args )
        // },
        on: ( channel, listener ) => {
            console.log('channel', channel);
            console.log('listener: ', listener);
            ipcRenderer.on( channel, listener )
        },
        // once: ( channel, listener ) => {
        //     ipcRenderer.once( channel, listener )
        // },
        // removeListener: ( channel, listener ) => {
        //     ipcRenderer.removeListener( channel, listener )
        // },
        // removeAllListeners: ( channel ) => {
        //     ipcRenderer.removeAllListeners( channel )
        // }
    }
)
// window.ipcRenderer = ipcRenderer
