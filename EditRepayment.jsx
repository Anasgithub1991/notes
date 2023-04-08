import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useApi } from '../../../util'
import { NotificationMsg, DangerMsg } from '../../../components/NotificationMsg'
import {
    CButton, CModal, CModalBody, CModalFooter, CDataTable, CModalHeader, CModalTitle, CRow,
    CFormGroup, CLabel, CInput, CInvalidFeedback, CTooltip, CCol, CInputGroupPrepend, CInputGroup, CInputGroupText, CTextarea
} from '@coreui/react'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';


const EditRepayment = ({ modal, items, sentProps, getData,toggle }) => {

    const [rep, setrep] = useState([{
        Recept_name: '',
        amount: '',
        rePayment_amount: '',
        remainder: '',
        total_rePayment_amount: '',
        isPaid: false,
        notes: '',
        noChecks: '',
        dtDoc: '',
        noDaily: '',
        dtDaily: ''
    }])
    const modalOpen = () => {
//         setrep([{
//             Recept_name:Recept_name? Recept_name : "",
//             // amount ? amount : "",
//             // rePayment_amount ? rePayment_amount : "",
//             // remainder ? remainder : "",
//             // total_rePayment_amount ? total_rePayment_amount : "",
//             // isPaid ? isPaid : "",
//             // notes ? notes : "",
//             // noChecks ? noChecks : "",
//             // dtDoc ? dtDoc : "",
//             // noDaily ? noDaily : "",
//             // dtDaily ? dtDaily : "",
//            }
// ]
//         )

        // sentProps && seteditbutton(true)
        // sentProps && GetDataEdit()
    }
    const d = new Date();
    const getValue = (value) => {
        let monthYear = value.split("-");
        
        // monthYear && setmonth(monthYear[1]);
        // monthYear && setyear(monthYear[0]);
        // monthYear && setday(monthYear[2])
        return monthYear
        // console.log('date', month)
    }

    const total_rePayment_input = rep.reduce((sum, current) => {
        return sum + parseFloat(current.rePayment_amount)
    }, 0)

    const GetExchange_Id = (async (idx) => {
   let date=   getValue(rep[idx].dtDaily)  
     console.log('dateinexched',`api/analysis/GetExchange_Id/noDaily/${rep[idx].noDaily}/year/${date[0]}/month/${date[1]}`)
        try {
             
            let { success, data } = await api('GET', `api/analysis/GetExchange_Id/noDaily/${rep[idx].noDaily}/year/${date[0]}/month/${date[1]}`)
            if (!success) {
                DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
                
                return  

            }
            EditAnalysis(idx,data)

        } catch (err) {
            DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
            console.error(err)
        }

    })
    const GetRepaymentForEdit = (async () => {

        try {
            let { success, data } = await api('GET', `api/analysis/update/Check_details_id/${sentProps}`)
            if (!success) {
                DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
                return
            }
            setrep([...data])
        } catch (err) {
            DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
            console.error(err)
        }

    })
    const AnasMap=(arr,functions)=>{
        let arr2=[]
      
        for (let i = 0; i < arr.length; i++) { 
          arr2.push(functions(arr[i],i))
        }
        return arr2
         }

    useEffect(() => { GetRepaymentForEdit() }, [sentProps,])

    const EditAnalysis = (async (idx,exchid) => {
        console.log('exchid',exchid)
        if (exchid.length === 0)

        return DangerMsg("لا توجد هكذا رقم يومية", "خطأ في اضافة البيانات")
        if (total_rePayment_input > rep[idx].amount)

            return DangerMsg("مجموع التسديد اكبر من مبلغ المنح", "خطأ في تعديل البيانات")
         try {
    
            let payload = {...rep[idx], exchId: exchid[0].exchange_id}
            console.log("payload", payload) 
            let { success } = await api("PUT", `api/analysis`, payload)
            if (!success) {
                DangerMsg("مشكلة في تعديل التسديد", "خطأ في تعديل البيانات")
                return
            }
            NotificationMsg("التسديد", "تم التعديل بنجاح")
            getData()
            GetRepaymentForEdit()
        }
        catch (err) {
            DangerMsg("اشعارات مستند القيد", "خطأ في تعديل البيانات")
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
                scrollable
                fade
            >
                <CModalHeader closeButton>
                    <CModalTitle>{'تعديل تسديد السلف'}</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ maxWidth: '1400px' }}>
                    <CRow>
                        <CCol sm='12' id='analysis'>
                            <CLabel htmlFor='Recept_name'> <h3>{items.Recept_name}</h3></CLabel>
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
                            <CLabel htmlFor='amount' style={{ fontWeight: 'bold', fontSize: 'medium' }}> {(items.amount).toLocaleString('ar-u-nu-arab')}</CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis'style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                            <CLabel htmlFor='total_rePayment_amount' style={{ fontWeight: 'bold', fontSize: 'medium' }}> {(items.total_rePayment_amount).toLocaleString('ar-u-nu-arab')}</CLabel>
                        </CCol>
                        <CCol sm='4' id='analysis'>
                            <CLabel style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                                { (((items.amount - total_rePayment_input) <= -1 ? 'الرقم بالسالب' : items.amount - total_rePayment_input).toLocaleString('ar-u-nu-arab')) }
                            </CLabel>
                        </CCol>
                    </CRow>
                    <br></br>
                    <CRow>
                        <CCol sm='1' id='analysis'>
                            <CLabel htmlFor='index' style={{ fontWeight: 'bold', fontSize: 'small' }}> ت</CLabel>
                        </CCol>
                        <CCol sm='1' id='analysis'>
                            <CLabel htmlFor='noDaily' style={{ fontWeight: 'bold', fontSize: 'small' }}> رقم يومية </CLabel>
                        </CCol>
                        <CCol sm='3' id='analysis'>
                            <CLabel htmlFor='dtDaily' style={{ fontWeight: 'bold', fontSize: 'small' }}> تاريخ اليومية  </CLabel>
                        </CCol>
                        <CCol sm='1' id='analysis'>
                            <CLabel htmlFor='noDoc||norDoc' style={{ fontWeight: 'bold', fontSize: 'small' }}> رقم المستند </CLabel>
                        </CCol>
                        <CCol sm='3' id='analysis'>
                            <CLabel htmlFor='dtDoc' style={{ fontWeight: 'bold', fontSize: 'small' }}> تاريخ المستند </CLabel>
                        </CCol>
                        <CCol sm='2' id='analysis'>
                            <CLabel htmlFor='rePayment_amount' style={{ fontWeight: 'bold', fontSize: 'small' }}>مبلغ التسديد </CLabel>
                        </CCol>
                        <CCol sm='1' id='analysis'></CCol>
                    </CRow>
                   
                    {AnasMap(rep,(item, index) =>
                        <>
                            <CRow className={'analysis_row'}>
                                <CCol sm='1' width={'3px'}   >
                                    <CLabel htmlFor='index'> {index + 1}</CLabel>
                                </CCol>
                                <CCol sm='1' >
                                    <CInput
                                        htmlFor='noDaily'
                                        type='number'
                                        value={item.noDaily}
                                        // :item.rePayment_amount > (item.amount) ? item.rePayment_amount = 0  : item.rePayment_amount <= -1 ? item.rePayment_amount = 0: item.rePayment_amount} 
                                        onChange={
                                            (e) => {
                                                setrep(old => {
                                                    old[index].noDaily = e.target.value
                                                    return [...old]
                                                })}   }
                                    ></CInput>
                                </CCol>
                                <CCol sm='3' >
                                    <CInput style={{ maxWidth: "160px", minWidth: "128px", border: "1px solid" }}
                                        type="date"
                                        dateFormat='dd-MM-yyyy'
                                        id="dtDaily"
                                        value={(item.dtDaily)}
                                        onChange={
                                            (e) => {
                                                setrep(old => {
                                                    old[index].dtDaily = e.target.value
                                                    return [...old]
                                                })}}
                                    >
                                    </CInput>
                                </CCol>
                                <CCol sm='1' >
                                    <CLabel htmlFor='nordoc||noDoc'> {(item.noDoc) ? ((item.noDoc)) : ((item.nordoc))}</CLabel>
                                </CCol>
                                <CCol sm='3' >
                                    <CLabel htmlFor='dtDoc'> {item.dtDoc ? item.dtDoc : ''}</CLabel>
                                </CCol>
                                <CCol sm='2' style={{ padding: '4px 4px' }} >
                                    {/* اصغر من المتبقي و اصغر من المبلغ الكلي  */}
                                    <CInput
                                        type='number'
                                        value={item.rePayment_amount <= -1 ? item.rePayment_amount = 0 : (item.rePayment_amount)}
                                        onChange={
                                            (e) => {
                                                setrep(old => {
                                                    old[index].rePayment_amount = (e.target.value)
                                                    return [...old]
                                                })
                                            }}
                                    ></CInput>

                                </CCol>
                                <CCol sm='1' style={{ padding: '4px 4px' }} >
                                <CTooltip content={'تعديل تسديد'}>

                                    <CButton id='border-btn' 
                                        size='sm'
                                        block
                                        onClick={ () =>GetExchange_Id(index) }> <SaveOutlinedIcon color='info' /></CButton>
                                                                        </CTooltip>

                                </CCol>
                                <CCol sm='12' id='analysis'>
                                    <CTextarea
                                        style={{ background: '#B2B1B9', color: 'white' }}
                                        type='number'
                                        value={item.notes}
                                        onChange={
                                            (e) => {
                                                setrep(old => {
                                                    old[index].notes = e.target.value
                                                    return [...old]
                                                })
                                            }}
                                    ></CTextarea>
                                </CCol>
                            </CRow>
                        </> )}
                </CModalBody>
            </CModal>
        </>)}
export default EditRepayment

