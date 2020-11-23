
exports.configure = function () {
  return {
    dataSources: {
      dataMart: {
        type: "MSSQL",
        properties: {
          user: 'conteq',
          password: 'conteq',
          server: 'bi-serv01',
          database: 'LMGT.DataMart'
        }
      }
    },
    dataSets: {
      report: {
        dataSource: "dataMart",
        procedure:"[report].[GetReportActualByMonth]"
      },
      list: {
        dataSource: "dataMart",
        procedure:"[report].[GetFilterProject]"
      }
    }
  }
};