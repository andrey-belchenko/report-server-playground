var fs = require('fs');
var utils = require("./utils");

var templates = {};
function getTemplate(name) {
    if (!templates[name]) {
        templates[name] = fs.readFileSync("./client-template/" + name, 'utf8');
    }
    return templates[name].slice();
}
var metadata = {};
async function getOrQueryMetadata(name) {
    if (!metadata[name]) {
        metadata[name] = await utils.queryMetadata(name);
    }
    return Promise.resolve(metadata[name]);
}

function getMetadata(name) {
    return metadata[name];
}

function applyVar(template, name, value) {
    let res = template;
    name = `$${name}$`;
    let i = res.indexOf(name);
    //applying tabulation for multi row value
    while (i >= 0) {
        let di = 0;
        if (i > 0) {
            let c = res[i - di - 1];
            while (c == " " || c == "   ") {
                di++;
                c = res[i - di - 1];
            }
        }
        let tab = "";
        let v = value;
        if (di > 0) {
            tab = res.slice(i - di, i);
            v = value.replace(/\n/g, '\n' + tab);
        }
        let s1 = res.slice(0, i);
        let s2 = res.slice(i + name.length);

        res = [s1, v, s2].join("");
        i = res.indexOf(name);
    }
    return res;
}
var itemSuffix = "Item";

function mapItemsObject(template, itemsObject, targetVarName, callback) {
    let sValue = "";
    let config = utils.getDataConfig();
    for (let name in itemsObject) {
        let item = itemsObject[name];
        var sval = callback(name, item);
        sValue += sval;
    }
    template = applyVar(template, targetVarName, sValue);
    return template;
}

exports.generate = async function () {
    utils.readDataConfig();
    let config = utils.getDataConfig();
    let stypes = "";
    let mt = getTemplate("main");
    //for further synchronous usage
    for (let name in config.data) {
        let item = config.data[name];
        // 
        if (item.dataSource) {
            await getOrQueryMetadata(name);
        }
    }


    mt = mapItemsObject(mt, config.data, "itemInterfaces",
        (name, item) => {
            let metadata = null;
            if (item.dataSource) {
                metadata = getMetadata(name);
            }
            if (metadata) {
                let it = getTemplate("item-interface");
                it = applyVar(it, "name", name + itemSuffix);
                let sfields = "";
                for (let fieldName in metadata.fields) {
                    let ft = getTemplate("field");
                    ft = applyVar(ft, "name", fieldName);
                    ft = applyVar(ft, "type", metadata.fields[fieldName].type);
                    sfields += ft;
                }
                it = applyVar(it, "fields", sfields);
                return it;
            } else {
                return "";
            }
        }
    );
    mt = mapItemsObject(mt, config.data, "stateFields",
        (name, item) => {
            let type = "";
            if (item.dataSource) {
                type = name + itemSuffix + "[]";
            } else {
                type = typeof (config.data[name].example);
            }
            let ft = getTemplate("field");
            ft = applyVar(ft, "name", name);
            ft = applyVar(ft, "type", type);
            return ft;
        }
    );

    mt = mapItemsObject(mt, config.data, "stateFieldsValues",
        (name, item) => {
            let value = "";
            if (item.dataSource) {
                value = `new Array<${name + itemSuffix}>()`;
            } else {
                value = config.data[name].example.toString();
            }
            let ft = getTemplate("field-value");
            ft = applyVar(ft, "name", name);
            ft = applyVar(ft, "value", value);
            return ft;
        }
    );


    mt = mapItemsObject(mt, config.data, "reducers",
        (name, item) => {
            let ft = getTemplate("reducer");
            ft = applyVar(ft, "item", name);
            return ft;
        }
    );


    mt = mapItemsObject(mt, config.data, "dataItems",
        (name, item) => {
            let ft = null;
            if (item.dataSource) {
                ft = getTemplate("remote-item");
                let metadata = getMetadata(name);
                ft = mapItemsObject(ft, metadata.params, "params", (name, item) => {
                    let it = getTemplate("param");
                    it = applyVar(it, "name", name);
                    it = applyVar(it, "type", item.type);
                    return it;
                });
                ft = mapItemsObject(ft, metadata.params, "values", (name) => {
                    let it = getTemplate("value");
                    it = applyVar(it, "name", name);
                    return it;
                });
            } else {
                ft = getTemplate("local-item");
            }
            ft = applyVar(ft, "name", name);
            return ft;

        }
    );
    fs.writeFileSync("1.txt", mt);



}

exports.generate();

