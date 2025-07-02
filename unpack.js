const hooks = [
    ['open', 0],
    ['openat', 1],
    ['access', 0],
    ['stat', 0],
    ['lstat', 0],
    ['mkdir', 0],
    ['mkdirat', 1],
    ['opendir', 0],
    ['unlink', 0],
    ['rmdir', 0],
    ['fopen', 0],
];

function readStr(ptr) {
    return (ptr && ptr.readCString) ? ptr.readCString() : '';
}

function shouldPrint(path) {
    if (!path || !path.startsWith('/')) return false;
    return true;
}

for (const [funcName, pathIndex] of hooks) {
    const addr = Module.findExportByName(null, funcName);
    if (!addr) continue;

    Interceptor.attach(addr, {
        onEnter(args) {
            this.path = readStr(args[pathIndex]);
        },
        onLeave() {
            if (shouldPrint(this.path)) {
                console.log(`[${funcName}] ${this.path}`);
            }
        }
    });
}
