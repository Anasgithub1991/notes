import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../../../util'
import { NotificationMsg, DangerMsg } from '../../../components/NotificationMsg'
import {CButton, CDataTable,CTooltip,CBadge,CCardBody} from '@coreui/react'
import EditIcon from '@mui/icons-material/Edit'
import AddRepayment from './AddRepayment'
import EditRepayment from  './EditRepayment'

const DisplayRepayment=()=>{
const add=(item,index)=>{
  toggleAdd()
  setSentProps(item)
  setRepayment(1)
  setitems(index)}
    const [modalAdd, setModalAdd] = useState(false)
    const toggleAdd = () => {
      setModalAdd(!modalAdd)
    }
    const [modalEdit, setModalEdit] = useState(false)
    const toggleEdit = () => {
      setModalEdit(!modalEdit)
    }
    const [items, setitems] = useState(0)

    const [sentProps, setSentProps] = useState(null)
    const [Repayment,setRepayment]=useState(3)

    const [dataDisplay, setdataDisplay] = useState([{
        Recept_name: '',
        amount: '',
        rePayment_amount: '',
        total_rePayment_amount: '',
        remainder: '',
        isPaid: false,
        notes: '',
        noChecks: '',
        dtCheck: '',
        noDaily: '',
        dtDaily: ''
    }])
  

    const GetRepayment = (async () => {
        try {
            let { success, data } = await api('GET', `api/analysis/showdata`)
            if (!success) {
                DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
                return
            }
            setdataDisplay([...data])
        } catch (err) {
            DangerMsg("اشعارات التسديد", "خطأ في تحميل البيانات")
            console.error(err)
        }

    })


    useEffect(() => { GetRepayment()},[])



            const api = useApi()
            const fields = [
                {
                  key: 'no',
                  label: 'ت',
                  _style: { width: '0px' },
                },
                {
                  key: 'status',
                  label: 'حالة التسديد',
                  _style: { width: '1px' },
                },
                {
                  key: 'Recept_name',
                  label: 'اسم المستلم ',

                }, 
                 {
                    key: 'noDaily',
                    label: 'رقم اليومية',
                    _style: { width: '1px' },

                  },
                  {
                    key: 'dtDaily',
                    label: 'تاريخ اليومية',
                    _style: { width: '12cm' },
                  },
                {
                  key: 'nordoc',
                  key: 'noDoc',
                  label: 'رقم المستند',
                  _style: { width: '1px' },

                },
                {
                  key: 'dtDoc',
                  label: 'تاريخ المستند',
                }, {
                  key: 'docSummary',
                  label: 'خلاصة المستند',
                  _style: { width: '100px' },
                },
                {
                  key: 'amount',
                  label: 'المبلغ',
                }, 
               {
            key:'total_rePayment_amount',
            label:'مجموع التسديد',
               },
             
                {
                  key: 'remainder',
                  label: 'المتبقي',
                },
                {
                  key: 'notes',
                  label: 'الملاحظات',
                  _style: { width: '4cm' },
               
                },
                {
                  key: 'action',
                  label: '',
                  // _style: { width: '15%' },
                  sorter: false,
                  filter: false,
                },
                
              ]
           
    return(
        <>
        
          <AddRepayment
        modal={modalAdd}
        toggle={toggleAdd}
        getData={GetRepayment}
        sentProps={sentProps}
        items={dataDisplay[items]}
      />
         <EditRepayment
        modal={modalEdit}
        toggle={toggleEdit}
        getData={GetRepayment}
        sentProps={sentProps}
        items={dataDisplay[items]}
      />
        


           <CCardBody   style={{
                                padding: '1px',
                            }}>
           <CDataTable
                fields={fields}
                items={dataDisplay}
                itemsPerPage={20}
                pagination
                columnFilter
                tableFilter
                itemsPerPageSelect
                sorter
                hover  
                
                scopedSlots={{
                  Recept_name: (item, index) => <td style={{ minWidth: '200px' }}>{item.Recept_name}</td>,
                   no: (item, index) => <td style={{ minWidth: '1px' }}>{index + 1}</td>,
                   amount:(item)=><td style={{ minWidth: '50px' }}>{(item.amount).toLocaleString('ar-u-nu-arab')}</td>,
                   total_rePayment_amount:(item)=><td style={{ minWidth: '50px' }}>{(item.total_rePayment_amount).toLocaleString('ar-u-nu-arab')}</td>,
                   remainder:(item)=><td style={{ minWidth: '50px' }}>{(item.remainder).toLocaleString('ar-u-nu-arab')}</td>,
                   noDaily:(item)=><td >{parseFloat(item.noDaily).toLocaleString('ar-u-nu-arab')}</td>,
                  //  dtDaily:(item)=><td>{parseFloat(item.dtDaily).toLocaleString('ar-u-nu-arab')}</td>,
                  //  dtDoc:(item)=><td>{parseFloat(item.dtDoc).toLocaleString('ar-u-nu-arab')}</td>,
                   noDoc:(item)=><td>{parseFloat(item.noDoc).toLocaleString('ar-u-nu-arab')}</td>,
                   nordoc:(item)=><td>{parseFloat(item.nordoc).toLocaleString('ar-u-nu-arab')}</td>,
                   docSummary:(item)=><td style={{ minWidth: '400px' }}>{item.docSummary}</td>,
                   notes:(item)=><td style={{ minWidth: '400px' }}>{item.docSummary}</td>,

                   status:(item,index)=><td>   {  
                  item.remainder==0 ? <CBadge
                      style={{ fontSize: 'smaller', paddingTop: '5px', minWidth: '65px', minHeight: '23px' }}
                      color="success"
                      shape="pill"
                    >
                      {'مسدد'}
                      </CBadge>

                      :<CBadge
                      style={{ fontSize: 'smaller', paddingTop: '5px', minWidth: '65px', minHeight: '23px' }}
                      color="danger"
                      shape="pill"
              
                    >
                      {'غير مسدد'}
                      </CBadge>
                    } </td>,
                   action: (item, index) => {
                      return (
                        <>
                        {(
                          <td style={{ minWidth: '150px' }}>
                            {/* edit roles */}
                     
                              {(
                                <CTooltip content={'اضافة تسديد'}>
                                  <CButton
                                    className="mr-1 ml-1 btn-edit"
                                    variant="outline"
                                    size="sm"
                                    color="success"
                                  onClick={() => {
                                    add(item.Check_id,index)
                                      // toggle()
                                      // setSentProps(item.Check_id)
                                      // setRepayment(1)
                                      // setitems(index)

                                    }} 
                                  >
    <svg
                          style={{ display: 'revert' }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="22"
                          viewBox="0 0 25 25"
                          fill="green"
                        >
                          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                        </svg>                                    {/* <InfoIcon className='icon-edit'/> */}
                                  </CButton>
                                </CTooltip>
                              )}
                            {/* edit roles */}
                            {(
                                <CTooltip
                                placement="bottom"
content={'تعديل تسديد'}>
                                  <CButton
                                    className="mr-1 ml-1 btn-edit"
                                    variant="outline"
                                    size="sm"
                                    color="warning"
                                    onClick={() => {
                                      setitems(index)
                                      toggleEdit()
                                      setSentProps(item.Check_details_id)
                                      setRepayment(2)
                                    }}
                                  >
                                    <EditIcon className="icon-edit" />
                                  </CButton>
                                </CTooltip>
                              )}    
                          </td> )}                           
                        </>                     
                      )},
                     }}
                />
 </CCardBody>             
</>
    )
}
export default DisplayRepayment




  {/* <CRow
                ><CCol sm='5'>
                        <CLabel style={{ fontWeight: 'bold' }}> اختيار رقم اليومية</CLabel>

                        <CInput value={ndaily} type='number' id='analysis-input2'
                            onChange={(e) => setndaily(e.target.value)}
                        ></CInput>

                    </CCol>
                    <CCol sm='5'>
                        <CLabel style={{ fontWeight: 'bold' }}> اختيار  رقم المستند</CLabel>

                        <CInput type='number' id='analysis-input2'
                        value={nodoc}
                            onChange={(e) => { setnodoc(e.target.value); setnordoc(e.target.value) }}
                        ></CInput>

                    </CCol>
                    <CCol sm='1'>
                    </CCol>
                    <CCol sm='5'>
                        <CLabel style={{ fontWeight: 'bold' }}> اختيار السنة</CLabel>
                        <CInput 
                         type='number' placeholder='YYYY' 
                         htmlFor='Recept_name'
                         id='analysis-input2'
                         value={yearDaily}
                        onChange={(e) => setyearDaily(e.target.value)}

                        ></CInput>

                    </CCol>
                </CRow> */}