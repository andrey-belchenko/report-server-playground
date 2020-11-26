


var path = require('path');
var sql = require("mssql");
var dataConfig = null;

exports.getDataConfig = function () {
    return dataConfig;
}

exports.readDataConfig = function () {
    var filePath = path.join(process.cwd(), 'crs.js');
    delete require.cache[filePath];
    var configJs = require(filePath);
    dataConfig = configJs.configure();
}


async function executeSqlProcedure(conConfig, procName, params) {
    await sql.connect(conConfig);
    var request = new sql.Request();
    for (let parName in params) {
        request.input(parName, params[parName]);
    }
    var result = await request.execute(procName);
    return Promise.resolve(result.recordsets[0]);
}
async function executeSqlQuery(conConfig, query) {

    await sql.connect(conConfig);
    var request = new sql.Request();
    var result = await request.query(query);
    return Promise.resolve(result.recordsets[0]);
}

exports.queryData = async function (dataSetName, params) {
    var dataSet = dataConfig.data[dataSetName];
    var conConfig = dataConfig.dataSources[dataSet.dataSource].properties;
    var data = await executeSqlProcedure(conConfig, dataSet.procedure, params);
    return Promise.resolve(data);
}
//TODO : не проверено
var sqlToJsTypes = {
    "BIGINT": "number",
    "INT": "number",
    "BINARY": "string",
    "BIT": "boolean",
    "BOOLEAN": "boolean",
    "CHAR": "string",
    "DATE": "date",
    "DECIMAL": "number",
    "DOUBLE": "number",
    "FLOAT": "number",
    "INTEGER": "number",
    "LONGVARBINARY1": "string",
    "LONGVARCHAR2": "string",
    "REAL": "number",
    "SMALLINT": "number",
    "TIME": "date",
    "TIMESTAMP": "date",
    "TINYINT": "number",
    "VARBINARY": "string",
    "VARCHAR": "string"
}

function sqlToJsType(sqlType) {
    sqlType = sqlType.split('(')[0].toUpperCase();
    let jsType = sqlToJsTypes[sqlType];
    if (!jsType) {
        jsType = "string";
    }
    return jsType;
}

exports.queryMetadata = async function (dataSetName) {
    var dataSet = dataConfig.data[dataSetName];
    var conConfig = dataConfig.dataSources[dataSet.dataSource].properties;

    var procObjectId = (await executeSqlQuery(conConfig, `select  max(OBJECT_ID(N'${dataSet.procedure}')) as id`))[0]["id"];
    if (!procObjectId) {
        throw new Error(`object ${dataSet.procedure} does not exist`)
    }
    var paramsQuery = `
SELECT 
    [name], 
    [type] = TYPE_NAME([user_type_id])
FROM 
    [sys].[parameters]
WHERE 
    object_id = OBJECT_ID(N'${dataSet.procedure}')
ORDER BY 
    [parameter_id]`;
    var paramsInfo = await executeSqlQuery(conConfig, paramsQuery);
    var factParsStr = "";
    var q = "";
    let params = {}
    for (let info of paramsInfo) {
        var parName = info.name.replace('@', '');
        params[parName] = { "type": sqlToJsType(info["type"]), "srcType": info["type"] };
        factParsStr += q + "null";
        q = ",";
    }

    var fieldsQuery = `
SELECT 
    [name],
    system_type_name as [type] 
FROM 
    [sys].[dm_exec_describe_first_result_set](N'exec ${dataSet.procedure} ${factParsStr}', NULL, 0);`;

    var fieldsInfo = await executeSqlQuery(conConfig, fieldsQuery);
    let fields = {}
    for (let info of fieldsInfo) {
        fields[info.name] = { "type": sqlToJsType(info["type"]), "srcType": info["type"] };
    }
    return Promise.resolve({ params: params, fields: fields });
}
