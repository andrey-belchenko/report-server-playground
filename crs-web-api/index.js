#!/usr/bin/env node
'use strict'
var express = require("express");
var app = express();

// Set up a whitelist and check against it:
// var whitelist = ['https://localhost:4321','http://localhost:3004']
var corsOptions = {
    origin: function (origin, callback) {
        // if (whitelist.indexOf(origin) !== -1) {
        //   callback(null, true)
        // } else {
        //   callback(new Error('Not allowed by CORS'))
        // }
        callback(null, true)
    }
}
var cors = require('cors');
// Then pass them to cors:
app.use(cors(corsOptions));

app.use('/app3', express.static('public/app3'));
app.use('/app4', express.static('public/app4'));
app.use('/src', express.static('src'));



app.use("/url", function (req, res, next) {
    var nodeSSPI = require('node-sspi')
    var nodeSSPIObj = new nodeSSPI({
        retrieveGroups: true
    })
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next()
    });

});


var path = require('path');
var sql = require("mssql");
var dataConfig = null;

function readDataConfig() {
    var filePath = path.join(process.cwd(), 'crs.js');
    delete require.cache[filePath];
    var configJs = require(filePath);
    dataConfig = configJs.configure();
}
readDataConfig();



async function executeSqlProcedure(conConfig, procName, params) {
    await sql.connect(conConfig);
    var request = new sql.Request();
    for (let parName in params) {
        request.input(parName, params[parName]);
    }
    var result = await request.execute(procName);
    return Promise.resolve(result.recordsets[0]);
}
async function executeSqlQuery(conConfig, query, parama) {
    await sql.connect(conConfig);
    var request = new sql.Request();
    var result = await request.query(query);
    return Promise.resolve(result.recordsets[0]);
}

async function queryData(dataSetName, params) {
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

async function queryMetadata(dataSetName) {
    var dataSet = dataConfig.dataSets[dataSetName];
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
app.use(express.json());
app.use("/datasets", function (req, res) {
    readDataConfig();
    var aurl = req.url.split('/');
    var dsName = aurl[1];
    var subUrl = aurl[2];
    switch (subUrl) {
        case 'data':
            queryData(dsName, req.body).then(function (data) {
                res.send(data);
            });
            break;
        case 'metadata':
            queryMetadata(dsName).then(function (model) {
                res.send(model);
            })
            break;
    }
});

app.get("/test", (req, res, next) => {
    res.send("Ок");
});


app.get("/url", (req, res, next) => {

    const os = require('os');
    const userInfo = os.userInfo();

    var fs = require('fs');
    var filedata = '';
    fs.readFile('test.txt', 'utf8', function (err, data) {
        if (err) {
            return res.json(err);
        }
        var filedata = data;

        var out =
            'Hello ' +
            req.connection.user + "(" + userInfo.username + ")"
        '! Your sid is ' +
            req.connection.userSid +
            ' and you belong to following groups:<br/><ul>'
        if (req.connection.userGroups) {
            for (var i in req.connection.userGroups) {
                out += '<li>' + req.connection.userGroups[i] + '</li><br/>\n'
            }
        }
        out += '</ul>'
        out += filedata + "xxx" + __dirname + process.cwd();
        res.send(out);
    });
});


app.get("/sql", (req, res, next) => {
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'conteq',
        password: 'conteq',
        server: '192.168.0.115',
        database: 'RAOS.Extract'
    };

    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('SELECT TOP (10) * FROM [RAOS.Extract].[dbo].[AllDocs]', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            // res.send(recordset.recordset.columns);
            res.send(recordset.recordsets[0]);

        });
    });
});


app.listen(3004, () => {
    console.log("Server running on port 3004");
});