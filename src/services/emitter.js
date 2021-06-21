import mitt from 'mitt';

const emitter = mitt();

emitter.on('*', (type, e) => console.log('GLOBAL EVENT TRIGGERED: ', type, e) )

export default emitter;