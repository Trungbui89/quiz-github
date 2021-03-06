import React from 'react';
import { Box, Grid, IconButton, Checkbox, Input, FormHelperText } from '@mui/material';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import moment from "moment";
import AddCategories from './Categories/AddCategories';
import SearchButton from '../../../helper/GroupButton/SearchButton';
import TextFieldCustom from '../../../helper/TextFieldCustom';
import NotiflixReport from './NotiflixComponent/reportComponent';
import { convertDateStringLocalToISOUTC, convertDateTime12hours, convertUTCDateStringToLocal } from '../../../constants/shared'
import CandidateComponent from './CandidateComponent';
import RangeDateTimePicker from '../../../helper/RangeDateTimePicker';

// MODAL transition
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />
})

export default function CreateQuizPage(props) {
    const {
        postCreateQuizFunc,
        categories,
        createQuizForm,
        setCreateQuizForm,
        topicState,
        setTopicState,
        staffs,
    } = props;

    const handleChangeStaffsList = (data) => {
        validateProcessor('userId', data)
        setCreateQuizForm({ ...createQuizForm, userId: data });
    };

    const handleChangeCreateQuiz = (key, value) => {
        console.log(key)
        console.log(value)
        switch (key) {
            case 'description':
                validateProcessor(key, value)
                setCreateQuizForm({ ...createQuizForm, description: value })
                break;
            case 'range-time':
                validateProcessor(key, value)
                setCreateQuizForm({ ...createQuizForm,
                    startTime: value ? convertDateStringLocalToISOUTC(value[0]) : '',
                    expiredTime: value ? convertDateStringLocalToISOUTC(value[1]) : ''
                });
                break;
            // case 'start-time':
            //     validateProcessor(key, value)
            //     setCreateQuizForm({ ...createQuizForm, startTime: value ? convertDateStringLocalToISOUTC(value) : ''});
            //     break;
            // case 'expired-time':
            //     validateProcessor(key, value)
            //     setCreateQuizForm({ ...createQuizForm, expiredTime: value ? convertDateStringLocalToISOUTC(value) : ''});
            //     break;
            case 'quiz-time':
                if(value < 1) {
                setCreateQuizForm({ ...createQuizForm, quizTime: 1 });
                } else if(value > 600) {
                    setCreateQuizForm({ ...createQuizForm, quizTime: 600 });
                } else {
                setCreateQuizForm({ ...createQuizForm, quizTime: Number(value) });
                }
                break;
            default:
                break;
        }
    }

    const nowTime = moment().add(2, 'years')
    const [open, setOpen] = React.useState(false)
    const [modalStatus, setModalStatus] = React.useState(false)
    const [warningValue, setWarningValue] = React.useState('')
    const [helpTextValue, setHelpTextValue] = React.useState({
        description: false,
        startTime: false,
        expiredTime: false,
        userId: false
    })
    const [helpTextTopic, setHelpTextTopic] = React.useState([{
            cate: false,
            quantity: false
        }])

    const handleWarningModal = () => {
        setOpen(!open);
    }

    const validateDescription = (value) => {
        if(value === ''){
            return 'T??n kh??ng ???????c tr???ng'
        } else if(value.length >= 400) {
            return 'T??n kh??ng ???????c qu?? 400 k?? t???'
        } else {
            return ''
        }
    }

    const validateStartTime = (value) => {
        if (value === '') {
            return 'H??y ch???n th???i gian m???'
        } else if (moment(value).diff(nowTime, 'days') >= 0) {
            return 'Th???i gian m??? kh??ng qu?? 2 n??m so v???i hi???n t???i'
        } else {
            return ''
        }
    }

    const validateExpiredTime = (value) => {
        if(value === '') {
            return 'H??y ch???n th???i gian ????ng'
        } else if(moment(value).diff(nowTime, 'days') >= 0) {
            return 'Th???i gian ????ng kh??ng qu?? 2 n??m so v???i hi???n t???i'
        } else {
            return ''
        }
    }

    const validateUserId = (value) => {
        if(value.length <= 0) {
            return 'Ph???i c?? ??t nh???t 1 ???ng vi??n' 
        } else {
            return ''
        }
    }

    const validateProcessor = (key, value) => {
        switch (key) {
            case 'description':
                setHelpTextValue({...helpTextValue, description: validateDescription(value)})
                break
            case 'range-time':
                setHelpTextValue({...helpTextValue, startTime: validateStartTime(value[0]), expiredTime: validateExpiredTime(value[1])})
                break
            case 'userId':
                setHelpTextValue({...helpTextValue, userId: validateUserId(value)})
                break
            default:
                break
        }
    }

    const validateCategory = (index, value) => {
        if(value === '') {
            let newArray = [...helpTextTopic]
            newArray[index] = {...helpTextTopic[index], cate: 'Ch??? ????? kh??ng ???????c tr???ng'}
            return newArray
        } else {
            let newArray = [...helpTextTopic]
            newArray[index] = {...helpTextTopic[index], cate: ''}
            return newArray
        }
    }

    const validateQuantity = (index, value) => {
        if(value === null || value <= 0) {
            let newArray = [...helpTextTopic]
            newArray[index] = {...helpTextTopic[index], quantity: 'S??? c??u h???i kh??ng ???????c tr???ng'}
            return newArray
        } else {
            let newArray = [...helpTextTopic]
            newArray[index] = {...helpTextTopic[index], quantity: ''}
            return newArray
        }
    }

    const validateCategoryArray = (key, index, value) => {
        switch(key) {
            case 'category':
                setHelpTextTopic(validateCategory(index, value))
                break
            case 'quantity':
                setHelpTextTopic(validateQuantity(index, value))
                break
            default:
                break
        }
    }

    const handleValidate = function handleValidate() {
            if(
                Object.values(createQuizForm).filter(ele => ele === '').length <= 0
                &&
                createQuizForm.userId.length > 0
                &&
                topicState.filter(ele => ele.cate === '' || ele.quantity === null || ele.quantity == 0).length <= 0
            ) {
                setModalStatus(true)
            } else {
                setHelpTextValue({
                    ...helpTextValue, 
                    description: validateDescription(createQuizForm.description),
                    startTime: validateStartTime(createQuizForm.startTime),
                    expiredTime: validateExpiredTime(createQuizForm.expiredTime),
                    userId: validateUserId(createQuizForm.userId)
                })
                let newArray = [...topicState]
                
                setHelpTextTopic(
                    newArray.map((item) => {
                        if(item.cate === '') {
                            if(item.quantity == 0 || item.quantity === null) {
                                return {cate: 'Ch??? ????? kh??ng ???????c tr???ng', quantity: 'S??? c??u h???i kh??ng ???????c tr???ng'}
                            } else {
                                return {cate: 'Ch??? ????? kh??ng ???????c tr???ng', quantity: ''}
                            }
                        } else {
                            if(item.quantity == 0 || item.quantity === null) {
                                return {cate: '', quantity: 'S??? c??u h???i kh??ng ???????c tr???ng'}
                            } else {
                                return {cate: '', quantity: ''}
                            }
                        }
                    })
                )
            }
    }
    const [inputstatus, setInputStatus] = React.useState(false)
    const handleInputEnable = () => {
        setInputStatus(!inputstatus)
        setCreateQuizForm({ ...createQuizForm, quizTime: 0 })
    }

    const handleSubmit = () => {
        if(inputstatus) {
            if(createQuizForm.quizTime < 1 || createQuizForm.quizTime > 600) {
                handleWarningModal()
                setWarningValue({
                    icon: '/icon/Vector_warning.png',
                    message: 'Vui l??ng ??i???n th???i gian l??m b??i ( t??? 1 ?????n 600 ph??t)'
                })
            } else {
                postCreateQuizFunc()
            }
        } else {
            postCreateQuizFunc()
        }
    }

    return (
        <>
            <div className='card__list-test'>
                <div className="card__header">
                    <Link to="/quiz/create/quiz" className='back-button'>
                        <IconButton sx={{ marginLeft:'-15px' }}>
                            <img src="/icon/Back.svg" alt="back" />
                        </IconButton>
                    </Link>
                    <h3 className="">Qu???n l?? b??i ki???m tra</h3>
                </div>
                {/* <div style={{ marginLeft: '' }}>
                    <Link to="/quiz/create/quiz">
                        <Box className='box-header row'>
                            <IconButton>
                                <img
                                    src="/icon/Back.svg"
                                    alt="icon"
                                    weight="25"
                                    height="25"
                                />
                            </IconButton>
                            <div style={{color:'#0B176D'}}>T???o b??i ki???m tra</div>
                        </Box>
                    </Link>
                </div> */}
                <Grid container>
                    <Grid item xs={6}>
                        <Box className='box-input'>
                            <TextFieldCustom
                                fullWidth
                                title={`T??n b??i ki???m tra`}
                                placeholder='Nh???p t??n b??i ki???m tra'
                                values={createQuizForm.description}
                                helpText={helpTextValue.description}
                                onChange={(e) => handleChangeCreateQuiz('description',e.target.value)}
                                inputProps={{
                                    maxLength: 400
                                }}

                            />
                        </Box>
                        <Box className='box-input'>
                            <RangeDateTimePicker 
                                title='Th???i h???n'
                                // nameFrom='start-time'
                                // nameTo='expired-time'
                                nameTime='range-time'
                                handleChangeCreateQuiz={handleChangeCreateQuiz}
                            />
                        </Box>
                        {
                            (helpTextValue.startTime !== false || helpTextValue.expiredTime !== false) &&
                            (helpTextValue.startTime !== '' || helpTextValue.expiredTime !== '')
                            ?
                            <Grid container spacing={2} sx={styles.boxInputText}>
                                <Grid item lg={4} md={4} sm={4}/>
                                <Grid item lg={8} md={8} sm={8}>
                                    <Grid container spacing={2}>
                                        <Grid item lg={6} md={6} sm={6} style={{ padding: 0 }}>
                                            <div style={{ color: '#F64E60', fontSize: 12, textAlign: 'left', margin: '1px 0 0 10px', fontWeight: 500, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}} >
                                                {helpTextValue.startTime}
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} style={{ padding: 0 }}>
                                            <div style={{ color: '#F64E60', fontSize: 12, textAlign: 'left', margin: '1px 0 0 10px', fontWeight: 500, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}} >
                                                {helpTextValue.expiredTime}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            :
                            null
                        }
                        {/* <Grid container spacing={2}></Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div style={{ color: '#F64E60', fontSize: 12, textAlign: 'left', margin: '10px 0 0 10px', fontWeight: 500, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}} >
                                    {helpTextValue.startTime}
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{ color: '#F64E60', fontSize: 12, textAlign: 'left', margin: '10px 0 0 10px', fontWeight: 500, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}} >
                                    {helpTextValue.expiredTime}
                                </div>
                            </Grid>
                        </Grid> */}
                        <Box className='box-input'>
                            <TextFieldCustom
                                disabled={!inputstatus}
                                fullWidth
                                title={`Th???i gian l??m b??i`}
                                type='number'
                                value={createQuizForm.quizTime}
                                onChange={(e) => handleChangeCreateQuiz('quiz-time',e.target.value)} 
                            />
                        </Box>
                        <div style={styles.customTime}>
                            <Checkbox checked={inputstatus} sx={styles.checkbox} onChange={handleInputEnable}/>
                            <span>T??? ?????t th???i gian l??m b??i</span>
                        </div>
                        <AddCategories
                            categories={categories}
                            topicState={topicState}
                            setTopicState={setTopicState}
                            helpTextTopic={helpTextTopic}
                            setHelpTextTopic={setHelpTextTopic}
                            validateCategoryArray={validateCategoryArray}
                        />
                    </Grid>
                    <Grid item xs={6} style={{padding:'0px 10px'}}>
                        <Grid container className='box-multi-select'>
                            <Grid item xs={2}>
                                <div className='title'>???ng vi??n</div>
                            </Grid>
                            <Grid item xs={8}>
                                <CandidateComponent 
                                    staffs={staffs}
                                    handleChangeStaffsList={handleChangeStaffsList}
                                />
                                <div style={{ color: '#F64E60', fontSize: 12, textAlign: 'left', margin: '10px 0 0 10px', fontWeight: 500, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}} >
                                    {helpTextValue.userId}
                                </div>
                                {/* <div className='select-multi' style={styles.selector}>
                                    <Select
                                        isMulti
                                        options={staffsList}
                                        styles={customStyles}
                                        placeholder='Nh???p t??n ???ng vi??n l??m b??i'
                                        onChange={(e) => handleChangeStaffsList(e)}
                                    />
                                </div>
                                <FormHelperText
                                    style={{        
                                        color: '#F64E60',
                                        fontSize: 12,
                                        margin: 0,
                                    }}
                                >
                                    {helpTextValue.userId??helpTextValue.userId}
                                </FormHelperText> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', width: '80%'}}>
                    <SearchButton
                        title="T???o b??i ki???m tra"
                        searchQuizBarStyle={{
                            width: '100%',
                            height: '110%',
                            fontSize: '1rem',
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                        onClick={handleValidate}
                    />
                </Box>
            </div>
            <Dialog
                open={modalStatus}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setModalStatus(!modalStatus)}
                style={styles.modal}
                aria-describedby="alert-dialog-slide-description"
            >
                <div style={{ padding: '2rem' }}>
                    <div style={styles.modalHeader}>
                        <div style={{ width: '10vh',height: '10vh', textAlign: 'center', marginTop: '15px' }}>
                            <img src="/icon/Create_quiz_icon.svg" alt="" />
                        </div>
                        <h4 style={styles.h4}>B???n c?? ch???c ch???n mu???n t???o b??i ki???m tra n??y kh??ng?</h4>
                    </div>
                    <div style={styles.modalBody}>
                        <p>{`Th???i gian: `}<b>{convertUTCDateStringToLocal(createQuizForm.startTime)} - {convertUTCDateStringToLocal(createQuizForm.expiredTime)}</b></p>
                        <p>{`Ch??? ?????: `}
                            <b>{categories.reduce((init, item) => 
                                    {
                                        return topicState.map((ele) => ele.cate.id).includes(Number(item.id)) 
                                        ? 
                                         init = [...init, (item.name.charAt(0).toUpperCase() + item.name.slice(1))] 
                                        : 
                                         init
                                    },[]).toString()
                                }
                            </b>
                        </p>
                        <p>{`S??? ng?????i tham gia: `}<b>{createQuizForm.userId.length}</b></p>
                        <p>{`S??? c??u: `}<b>{topicState.reduce((init, item) => {return init + item.quantity}, 0)} c??u</b></p>
                        <p>{`S??? ph??t d??? ?????nh: `}<b>{topicState.reduce((init, item) => {return init + item.quantity}, 0)} ph??t</b></p>
                        <div style={styles.btnGroup}>
                            <SearchButton 
                                title='X??c nh???n t???o'
                                onClick={handleSubmit}
                            />
                            <SearchButton 
                                title='Quay l???i'
                                createQuizStyle={{ 
                                    marginLeft: '15px', 
                                    backgroundColor: '#FF5151'
                                }}
                                onClick={() => setModalStatus(!modalStatus)}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
            <NotiflixReport open={open} handleWarningModal={handleWarningModal} warningValue={warningValue}/>
        </>
    )
}

const styles = {
    boxInputText: {
        width: '95%',
        margin: 'auto'
    },
    selector: {
        paddingTop: '5px',
        paddingRight: '6rem'
    },
    modal: {
        top: '-5vh',
        fontFamily: `Quicksand, sans-serif`,
        color: '#525252'
    },
    h4: { 
        textAlign: 'center', 
        padding: '15px 5px', 
        fontWeight: 'bold' 
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
        padding: '0 15px 25px'
    },
    customTime: {
        // position: 'absolute',
    },
    checkbox: { 
        paddingLeft: 0, 
        marginLeft: '-3px' 
    },
    input:() => ({
        width: '60px',
        height: '1.5rem',
        margin: '0 8px'
    }),
    btnGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
}

const customStyles = {
    dropdownIndicator: () => ({
        display: 'none'
    }),
    option: (provided, state) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided) => ({
        ...provided,
        width: '100%',
        height: '33vh',
        alignItems: 'flex-start',
        overflow: 'scroll',
    }),
    multiValue: (provided) => ({
        ...provided,
        width: '100%',
        justifyContent: 'space-between',
        fontSize: '1.2rem',
        marginTop: '5px',
        color: '#3577CD',
        backgroundColor: '#E7F3FF'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#3577CD',
    })
  }