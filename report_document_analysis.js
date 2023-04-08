const Analysis = require('../models/Report_Document_Analysis')
const router = require('express').Router()
const { notifyMessage } = require('../utils/notification')

router.get('/GetExchange_Id/noDaily/:noDaily/year/:year/month/:month', async (req, res) => {
    try {
        let analysis = await Analysis.GetExchange_Id(req.params.noDaily,req.params.year,req.params.month)
        res.status(200).json(analysis)
    }

    catch (error) { res.status(400).json(notifyMessage(false, 'analysis not get GetExchange_Id ', '', error)) }
})
router.get('/insert/Check_id/:Check_id', async (req, res) => {
    try {
      
        let analysis = await Analysis.creditForInsert(req.params.Check_id)
        res.status(200).json(analysis)
    }

    catch (error) { res.status(400).json(notifyMessage(false, 'analysis not get data ', '', error)) }
})
router.get('/showdata', async (req, res) => {
    try {
        let analysis = await Analysis.credit()
        res.status(200).json(analysis)
    }

    catch (error) { res.status(400).json(notifyMessage(false, 'analysis add data', '', error)) }
})
router.get('/insert/Check_id/:Check_id', async (req, res) => {
    try {
      
        let analysis = await Analysis.creditForInsert(req.params.Check_id)
        res.status(200).json(analysis)
    }

    catch (error) { res.status(400).json(notifyMessage(false, 'analysis add data', '', error)) }
})
router.get('/update/Check_details_id/:Check_details_id', async (req, res) => {
    try {
        let analysis = await Analysis.creditForUpdate(req.params.Check_details_id)
        res.status(200).json(analysis)
    }

    catch (error) { res.status(400).json(notifyMessage(false, 'analysis not get data for update ', '', error)) }
})

router.put('/', async (req, res) => {

    let payload = req.body
    let analysis
        try{
            analysis = await Analysis.update(payload)

        res.status(200).json(analysis)}
    
    catch (error) {
        res.status(400).json(notifyMessage(false, 'analysis not updated', '', error))
        console.log(error)
    }
})
router.post('/', async (req, res) => {

    let payload = req.body
    let analysis
    try {
        
            analysis = await Analysis.insert(payload)
        
        res.status(200).json(analysis)
    }
    catch (error) {
        res.status(400).json(notifyMessage(false, 'analysis not inserted', '', error))
        console.log(error)
    }
})
module.exports = router



