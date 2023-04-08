import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useApi } from '../../../util'
import { NotificationMsg, DangerMsg } from '../../../components/NotificationMsg'
import {
    CButton, CModal, CModalBody, CModalFooter, CDataTable, CModalHeader, CModalTitle, CRow,
    CFormGroup, CLabel, CInput, CInvalidFeedback, CTooltip, CCol, CInputGroupPrepend, CInputGroup, CInputGroupText
    , CTextarea,
    CFooter
} from '@coreui/react'
import { AltRouteTwoTone } from '@mui/icons-material'
const AddRepayment = ({ modal,items,getData,toggle }) => {

    const [rep, setrep] = useState({
        Recept_name: '',
        Check_details_id:"",
        Check_id:'',
        amount: '',
        rePayment_amount: '',
        total_rePayment_amount: '',
        remainder: '',
        isPaid: false,
        notes: '',
        noChecks: '',
        dtDoc: '',
        noDaily: '',
        dtDaily: ''
    })
    const [exchId, setexchId] = useState([])

    const modalOpen = () => {
        // !sentProps 
        // sentProps && seteditbutton(true)
        // sentProps && GetDataEdit()
          setrep({
            Recept_name:items? items.Recept_name : "",
            Check_details_id:items?items.Check_details_id:"",
            Check_id:items?items.Check_id:'',
            rePayment_amount:items?items.rePayment_amount:"",
            amount:items ? items.amount : "",
            remainder:items ? items.remainder : "",
            total_rePayment_amount:items? items.total_rePayment_amount : "",
            isPaid:items? items.isPaid : "",
            notes:items? items.notes : "",
            noChecks:items? items.noChecks : "",
            dtDoc:items? items.dtDoc : "",
            noDaily:items? items.noDaily : "",
            dtDaily:items? items.dtDaily : "",
           })}

    const d = new Date();
    const [year, setyear] = useState(d.getFullYear())
    const [month, setmonth] = useState(d.getMonth())
    const [noDaily, setnoDaily] = useState(51);
    const [day, setday] = useState(d.getDay());

    const getValue = (value) => {
        let monthYear = value.split("-");
        monthYear && setmonth(monthYear[1]);
        monthYear && setyear(monthYear[0]);
        monthYear && setday(monthYear[2])
        
    }

    const GetExchange_Id = (async () => {
        try {
            let { success, data } = await api('GET', `api/analysis/GetExchange_Id/noDaily/${noDaily}/year/${year}/month/${month}`)
            if (!success) {
                DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
                return
            }
            setexchId([...data])
            console.log('exchid', exchId)

        } catch (err) {
            DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
            console.error(err)
        }

    })
    // const GetRepayment = useCallback(async () => {
    //     try {
    //         let { success, data } = await api('GET', `api/analysis/insert/Check_id/${sentProps}`)
    //         if (!success) {
    //             DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
    //             return
    //         }
    //         setrep(...data)
    //         console.log('repayments', data)

    //     } catch (err) {
    //         DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
    //         console.error(err)
    //     }

    // },[])
 

    useEffect(() => { GetExchange_Id() }, [noDaily,month,year])

    const AddAnalysis = (async () => {
       
       if (exchId.length===0)
      return DangerMsg("لا توجد هكذا رقم يومية", "خطأ في اضافة البيانات")
       
        if (rep.remainder === 0)
            return DangerMsg("تم تسديد السلفة ", "خطأ في اضافة البيانات")

        if (rep.rePayment_amount === 0)
            return DangerMsg("يرجى اضافة مبلغ التسديد", "خطأ في اضافة البيانات")

        if (rep.rePayment_amount > rep.amount)
            return DangerMsg("مبلغ التسديد اكبر من مبلغ المنح", "خطأ في اضافة البيانات")

        if (rep.rePayment_amount > rep.remainder)
            return DangerMsg("مبلغ التسديد اكبر من المتبقي", "خطأ في اضافة البيانات")

        try {
            let payload = { ...rep, exchId:exchId[0].exchange_id }
            let { success } = await api("POST", `api/analysis`, payload)
            if (!success) {
                DangerMsg("مشكلة في اضافة مبلغ التسديد", "خطأ في اضافة البيانات")
                return
            }
            NotificationMsg("التسديد", "تم الاضافة بنجاح")
            getData()
            
        } catch (err) {
            DangerMsg("اشعارات مستند القيد", "خطأ في اضافة البيانات")
            console.error(err)
        }

    })
    const api = useApi()

    return (
        <>
            <CModal
                style={{ maxWidth: '1400px' }}
                onOpened={() => modalOpen()}
                show={modal}
                onClose={() => toggle()}
                size="xl"
                centered={true}
                onClosed={() => modal}
            >
                <CModalHeader closeButton>
                    <CModalTitle>{'اضافة تسديد السلف  '}</CModalTitle>:
                </CModalHeader>
                <CModalBody style={{ maxWidth: '1400px' }}>
                    <CRow></CRow>
                    <CRow>
                        <CCol sm='12' id='analysis'>
                            <CLabel htmlFor='Recept_name' > <h3>{rep.Recept_name}</h3></CLabel>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm='4' id='analysis'>
                            <CLabel htmlFor='amount' style={{ fontWeight: 'bold', fontSize: 'small' }}>المبلغ </CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis'>
                            <CLabel htmlFor='amount' style={{ fontWeight: 'bold', fontSize: 'small' }}>مجموع التسديد </CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis'>
                            <CLabel htmlFor='remainder' style={{ fontWeight: 'bold', fontSize: 'small' }}>المتبقي </CLabel>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm='4' id='analysis'>
                            <CLabel htmlFor='amount' style={{ fontWeight: 'bold', fontSize: 'medium' }}> {(rep.amount).toLocaleString('ar-u-nu-arab')}
                            </CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis' style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                            <CLabel htmlFor='total_rePayment_amount' style={{ fontWeight: 'bold', fontSize: 'medium' }}> {(items.total_rePayment_amount).toLocaleString('ar-u-nu-arab')}
                            </CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis' >
                            <CLabel style={{ textAlign: 'center', width: '100%' ,fontWeight: 'bold', fontSize: 'medium' }}>
                                {(((rep.amount - rep.total_rePayment_amount) - rep.rePayment_amount) <= -1 ? 'الرقم بالسالب' : ((rep.amount - rep.total_rePayment_amount) - rep.rePayment_amount).toLocaleString('ar-u-nu-arab'))}
                            </CLabel>
                        </CCol>
                        <CCol sm='2' style={{ padding: '10px 10px' }} >
                            <CLabel htmlFor='noDaily' style={{ fontWeight: 'bold', fontSize: 'small' }}> ادخل رقم اليومية</CLabel>
                        </CCol>
                        <CCol sm='1' style={{ padding: '10px 10px' }} >
                            <CInput type='number'
                                onChange={(e) => setnoDaily(e.target.value)}>
                                </CInput>
                        </CCol>
                        <CCol sm='12' >
                            <CInputGroup className="mb-3" >
                                <CCol sm='2' >
                               <CLabel htmlFor='rePayment_amount' style={{ fontWeight: 'bold', fontSize: 'small' }}> اختر السنة والشهر </CLabel>
                                </CCol>
                                <CInput style={{ maxWidth: "160px", minWidth: "128px", border: "1px solid" }}
                                    id="inputSuccess1i" type='date' value={year + '-' + month +'-'+ day}
                                    onChange={(e) => {
                                        getValue(e.target.value) }}
                                >
                                </CInput>
                            </CInputGroup>
                             </CCol>
                        <CCol sm='2' >
                            <CLabel htmlFor='rePayment_amount' style={{ fontWeight: 'bold', fontSize: 'small' }}>مبلغ التسديد </CLabel>
                        </CCol>
                        <CCol sm='4'  >
                            <CInput
                                id='analysis-input'
                                type='number'
                                value={rep.rePayment_amount <= -1 ? rep.rePayment_amount = 0 : rep.rePayment_amount}
                                onChange={e=>setrep({...rep,rePayment_amount:parseInt(e.target.value)})  }
                            ></CInput>
                        </CCol>
                    </CRow>
                    <>
                        <CRow className={'analysis_row'}>
                        </CRow>
                        <CRow>
                        <CCol sm='2' style={{ padding: '10px 10px' }}>
                        <CLabel htmlFor='notes' style={{ fontWeight: 'bold', fontSize: 'small' }}>الملاحظات</CLabel>
                            </CCol>
                           <CCol sm='4' style={{ padding: '10px 10px' }} >
                                       <CTextarea
                                        style={{ background: '#B2B1B9', color: 'white' }}
                                        type='number'
                                        value={rep.notes}
                                        onChange={e=>setrep({...rep,notes:e.target.value})}
      onCopy={(e)=>{e.persist() 
    console.log(e.preventDefault() ,'copy')}}
                                      
                                    ></CTextarea>
                            </CCol>
                        </CRow>
                    </>
                    <br></br>

                    <CButton id='border-btn' style={{ border: '1px solid #00bcd4' }}
                        size='lg'
                        block onClick={() => AddAnalysis()}
                        type="submit"> اضــــــافة
                    </CButton>
                </CModalBody>
            </CModal>
        </>
    )
}
export default AddRepayment




