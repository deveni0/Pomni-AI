import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

class UltraDB {
    #timer = null;
    #path;
    
    constructor() {
        this.#path = path.join(process.cwd(), 'system', 'database.json');
        this.data = this.load();
        return this.proxy();
    }
    
    load() {
        try {
            if (existsSync(this.#path)) {
                const raw = readFileSync(this.#path, 'utf-8');
                if (raw.trim()) {
                    return JSON.parse(raw);
                }
            }
        } catch {}
        return { groups: {}, users: {}, dev: false };
    }
    
    isValidId(id) {
        return id && !id.includes('@newsletter') && !id.includes('@lid') && id.includes('@');
    }
    
    proxy() {
        return new Proxy(this.data, {
            set: (obj, prop, val) => {
                obj[prop] = val;
                this.batchSave();
                return true;
            },
            get: (obj, prop) => {
                if (prop === 'groups') return this.proxyGroups(obj.groups);
                if (prop === 'users') return this.proxyUsers(obj.users);
                return obj[prop];
            }
        });
    }
    
    proxyGroups(groups) {
        return new Proxy(groups, {
            get: (target, id) => {
                if (!this.isValidId(id)) return undefined;
                if (!target[id]) {
                    target[id] = {};
                    this.batchSave();
                }
                return new Proxy(target[id], {
                    set: (obj, key, val) => {
                        if (val === false || val === 0 || val === undefined || val === null) {
                            delete obj[key];
                        } else {
                            obj[key] = val;
                        }
                        
                        if (Object.keys(obj).length === 0) {
                            delete target[id];
                        }
                        
                        this.batchSave();
                        return true;
                    }
                });
            },
            set: (target, id, val) => {
                if (!this.isValidId(id)) return false;
                if (val && Object.keys(val).length > 0) {
                    target[id] = val;
                } else {
                    delete target[id];
                }
                this.batchSave();
                return true;
            }
        });
    }
    
    proxyUsers(users) {
        return new Proxy(users, {
            get: (target, id) => {
                if (!this.isValidId(id)) return undefined;
                if (!target[id]) {
                    target[id] = {};
                    this.batchSave();
                }
                return new Proxy(target[id], {
                    set: (obj, key, val) => {
                        if (val === false || val === 0 || val === undefined || val === null) {
                            delete obj[key];
                        } else {
                            obj[key] = val;
                        }
                        
                        if (Object.keys(obj).length === 0) {
                            delete target[id];
                        }
                        
                        this.batchSave();
                        return true;
                    }
                });
            },
            set: (target, id, val) => {
                if (!this.isValidId(id)) return false;
                if (val && Object.keys(val).length > 0) {
                    target[id] = val;
                } else {
                    delete target[id];
                }
                this.batchSave();
                return true;
            }
        });
    }
    
    batchSave() {
        if (this.#timer) clearTimeout(this.#timer);
        this.#timer = setTimeout(() => {
            const cleanData = {
                groups: {},
                users: {},
                dev: this.data.dev
            };
            
            for (const [id, val] of Object.entries(this.data.groups)) {
                if (this.isValidId(id) && Object.keys(val).length > 0) {
                    cleanData.groups[id] = val;
                }
            }
            
            for (const [id, val] of Object.entries(this.data.users)) {
                if (this.isValidId(id) && Object.keys(val).length > 0) {
                    cleanData.users[id] = val;
                }
            }
            
            writeFileSync(this.#path, JSON.stringify(cleanData, null, 2));
            this.data = cleanData;
            this.#timer = null;
        }, 100);
    }
}

export default UltraDB;