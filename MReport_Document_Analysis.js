const request = require('../connection/sqlServer')
require('dotenv')
const { notifyMessage } = require('../utils/notification')
const moment = require('moment')

const Analysis = {}
Analysis.GetExchange_Id = (noDaily,year,month) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT         (id) as exchange_id, orgID, nordoc, noDoc, dtDoc, TaxidentityCard, dtStoreEntry, noBook, totalAmountDigit, authorizeExchange, recipientNM, identityCard, attachmentNum, totalAmountWrite, orderHisMoney, nmOrganize, docSummary, 
        noChecks, ispersonal, noDaily, dtDaily, dataEntry, created_at, updated_at, isFinal, isTransfer, userid, docNameID, doc_audit, audit_updated
FROM            exchange_documents
where docNameID=2 and noDaily=${noDaily} and year(dtDaily)=${year} and month(dtDaily)=${month}`;
        request.query(sql, (err, result) => {
            if (err)
                return reject(notifyMessage(false, 'analysys get add not read', '', err))
            return resolve(notifyMessage(true, 'analysis get add read succesfully', result.recordset, ''))
        })
    })
}

Analysis.credit = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT        Check_DetailTbl.id, Check_DetailTbl.Recept_name, Check_DetailTbl.amount, Check_DetailTbl.isPaid, exchange_documents.noChecks, exchange_documents.noDaily, exchange_documents.dtDaily, exchange_documents.dtDoc, 
                         exchange_documents.noDoc, exchange_documents.nordoc, Check_DetailTbl.Check_id, ISNULL(SUM(tblanalysis_1.rePayment_amount), 0) AS total_rePayment_amount, 0 AS rePayment_amount, 
                         Check_DetailTbl.amount - ISNULL(SUM(tblanalysis_1.rePayment_amount), 0) AS remainder, tblanalysis_1.Check_details_id, exchange_documents.docSummary, Check_DetailTbl.notes
FROM            tblexpensetabs INNER JOIN
                         Check_DetailTbl INNER JOIN
                         checkTbl ON Check_DetailTbl.Check_id = checkTbl.id INNER JOIN
                         exchange_documents ON checkTbl.exchange_documents_id = exchange_documents.id INNER JOIN
                         trans_exchange_documents ON exchange_documents.id = trans_exchange_documents.exchangeDoc_id ON tblexpensetabs.id = trans_exchange_documents.tblexpensetabs_id LEFT OUTER JOIN
                         tblanalysis AS tblanalysis_1 ON Check_DetailTbl.id = tblanalysis_1.Check_details_id
WHERE        (tblexpensetabs.section = 3) AND (tblexpensetabs.m1 = 2)
GROUP BY Check_DetailTbl.id, Check_DetailTbl.Recept_name, Check_DetailTbl.amount, Check_DetailTbl.isPaid, exchange_documents.noChecks, exchange_documents.noDaily, exchange_documents.dtDaily, exchange_documents.dtDoc, 
                         exchange_documents.noDoc, exchange_documents.nordoc, Check_DetailTbl.Check_id, exchange_documents.id, tblanalysis_1.Check_details_id, exchange_documents.docSummary, Check_DetailTbl.notes
ORDER BY remainder DESC`;
        request.query(sql, (err, result) => {
            if (err)
                return reject(notifyMessage(false, 'analysys not read', '', err))
                let AllData = []
                if (result.recordset[0]) {
                  result.recordset.forEach(data => {
                    if (data) {
                      data = {
                        ...data,
                        dtDoc: moment(data.dtDoc).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        dtDaily: moment(data.dtDaily).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        // created_at: moment(data.created_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // updated_at: moment(data.updated_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // audit_updated:data.audit_updated ? moment(data.audit_updated).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A') : null
                      }
                    }
                    // array.forEach(element => {
                        
                    // });

                    AllData.push(data)
                  });
                }
                return resolve(notifyMessage(true, 'analysis read succesfully', AllData, ''))
        })
    })
}
Analysis.creditForInsert = (Check_id) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT        Check_DetailTbl.id, Check_DetailTbl.Recept_name, Check_DetailTbl.amount, Check_DetailTbl.isPaid, exchange_documents.noChecks, exchange_documents.noDaily, exchange_documents.dtDaily, exchange_documents.dtDoc, 
        exchange_documents.noDoc, exchange_documents.nordoc, Check_DetailTbl.Check_id, ISNULL(SUM(tblanalysis.rePayment_amount), 0) AS total_rePayment_amount, 0 AS rePayment_amount, 
        Check_DetailTbl.amount - ISNULL(SUM(tblanalysis.rePayment_amount), 0) AS remainder, tblanalysis.Check_details_id, Check_DetailTbl.notes
FROM            Check_DetailTbl INNER JOIN
        checkTbl ON Check_DetailTbl.Check_id = checkTbl.id INNER JOIN
        exchange_documents ON checkTbl.exchange_documents_id = exchange_documents.id LEFT OUTER JOIN
        tblanalysis ON Check_DetailTbl.id = tblanalysis.Check_details_id
WHERE        (Check_DetailTbl.Check_id = ${Check_id})
GROUP BY Check_DetailTbl.id, Check_DetailTbl.Recept_name, Check_DetailTbl.amount, Check_DetailTbl.isPaid, exchange_documents.noChecks, exchange_documents.noDaily, exchange_documents.dtDaily, exchange_documents.dtDoc, 
        exchange_documents.noDoc, exchange_documents.nordoc, Check_DetailTbl.Check_id, tblanalysis.Check_details_id,Check_DetailTbl.notes`;

        request.query(sql, (err, result) => {
            if (err)
                return reject(notifyMessage(false, 'analysys get add not read', '', err))
                let AllData = []
                if (result.recordset[0]) {
                  result.recordset.forEach(data => {
                    if (data) {
                      data = {
                        ...data,
                        dtDoc: moment(data.dtDoc).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        dtDaily: moment(data.dtDaily).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        // created_at: moment(data.created_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // updated_at: moment(data.updated_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // audit_updated:data.audit_updated ? moment(data.audit_updated).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A') : null
                      }
                    }
                    
                    AllData.push(data)
                  });
                }
                return resolve(notifyMessage(true, 'analysis get add read succesfully', AllData, ''))
        })
    })
}
Analysis.creditForUpdate = (Check_details_id) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT        ed1.Recept_name, ed1.amount, ed1.isPaid, ed1.noChecks, ed1.Check_id, ed1.rePayment_amount, ed1.remainder, ed1.Check_details_id, ed1.total_rePayment_amount, ed1.exchange_id, ed2.nordoc, ed2.dtDoc, ed2.noDaily, 
        ed2.dtDaily, ed1.notes, ed1.id
FROM            (SELECT        Check_DetailTbl.Recept_name, Check_DetailTbl.amount, Check_DetailTbl.isPaid, exchange_documents.noChecks, exchange_documents.noDaily, exchange_documents.dtDaily, exchange_documents.dtDoc, 
                                   exchange_documents.noDoc, exchange_documents.nordoc, Check_DetailTbl.Check_id, ISNULL(tblanalysis_1.rePayment_amount, 0) AS rePayment_amount, Check_DetailTbl.amount - ISNULL
                                       ((SELECT        SUM(rePayment_amount) AS Expr1
                                           FROM            tblanalysis AS tblanalysis_2
                                           WHERE        (Check_details_id = ${Check_details_id})), 0) AS remainder, tblanalysis_1.Check_details_id, ISNULL
                                       ((SELECT        SUM(rePayment_amount) AS Expr1
                                           FROM            tblanalysis AS tblanalysis_2
                                           WHERE        (Check_details_id = ${Check_details_id})), 0) AS total_rePayment_amount, tblanalysis_1.exchange_id, tblanalysis_1.notes, tblanalysis_1.id
          FROM            Check_DetailTbl INNER JOIN
                                   checkTbl ON Check_DetailTbl.Check_id = checkTbl.id INNER JOIN
                                   exchange_documents ON checkTbl.exchange_documents_id = exchange_documents.id RIGHT OUTER JOIN
                                   tblanalysis AS tblanalysis_1 ON Check_DetailTbl.id = tblanalysis_1.Check_details_id
          WHERE        (tblanalysis_1.Check_details_id = ${Check_details_id})) AS ed1 INNER JOIN
        exchange_documents AS ed2 ON ed1.exchange_id = ed2.id`;
        request.query(sql, (err, result) => {
            if (err)
            
                return reject(notifyMessage(false, 'analysys get update not read', '', err))
                let AllData = []
                if (result.recordset[0]) {
                  result.recordset.forEach(data => {
                    if (data) {
                      data = {
                        ...data,
                        dtDoc: moment(data.dtDoc).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        dtDaily: moment(data.dtDaily).tz('Asia/Baghdad').format('YYYY-MM-DD'),
                        // created_at: moment(data.created_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // updated_at: moment(data.updated_at).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A'),
                        // audit_updated:data.audit_updated ? moment(data.audit_updated).tz('Asia/Baghdad').format('YYYY-MM-DD H:m:s A') : null
                      }
                    }
                    
                    AllData.push(data)
                  });
                }
                return resolve(notifyMessage(true, 'analysis get update read succesfully', AllData, ''))
        })
    })
}
Analysis.update = (Body) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE    tblanalysis  SET  exchange_id =${Body.exchId}, rePayment_amount=${Body.rePayment_amount} ,notes='${Body.notes}' where  id =${Body.id} `;
          request.query(sql, (error, result) => {
            if (error)
                return reject(notifyMessage(false, 'Analysis not updated', '', error))
            return resolve(notifyMessage(true, 'Analaysis updated succesfully', result.recordset, {}))
        })
    })
}

Analysis.insert = (Body) => {
    return new Promise((resolve, reject) => {

        let sql = `INSERT   INTO    tblanalysis  VALUES  (${Body.exchId},${Body.Check_details_id},${Body.rePayment_amount},'${Body.notes}')`;
        request.query(sql, (error, result) => {
            if (error)
                return reject(notifyMessage(false, 'Analysis not inserted', '', error))
            return resolve(notifyMessage(true, 'Analaysis inserted succesfully', result.recordset, {}))
        })
    })
}

module.exports = Analysis

