import React from 'react';
import { Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchButton from '../../../helper/GroupButton/SearchButton';
import InputSearchComponent from '../../../helper/InputSearchComponent';
import SelectFieldCustom from '../../../helper/SelectFieldCustom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateButton from '../../../helper/GroupButton/CreateButton';
import { importFileExcel } from '../../../api/actions'
import { toastSuccess, toastFail } from '../../../helper/Notification/utils'
import DialogUploadFille from './DialogUploadFille';
import PopupCustom from '../../../helper/PopupCustom';

function HeaderSearch(props) {
    const {
        categories,
        setFilterListQuestion,
        filterListQuestion,
        quesTypes,
        getFilterQuestion,
        toggleCreateQuestion,
        toggleCreateCateModal
    } = props;

    const [openUpload, setOpenUpload] = React.useState(false);
    const [filterQuestion, setFilterQuestion] = React.useState(filterListQuestion);

    const handleClickOpen = () => {
        setOpenUpload(true);
    };

    const handleCloseDialog = () => {
        setOpenUpload(false);
    };

    const onClickSearch = () => {
        if(filterQuestion){
            setFilterListQuestion(filterQuestion)
        }
    }

    const dataCategory = categories?.map((cate) => ({
        label: cate.name,
        value: cate.id,
    }));
    const dataQuestionType = quesTypes?.map((cate) => ({
        label: cate.name,
        value: cate.id,
    }));

    const handleChangeFilterQuestion = (key, value) => {
        if (key === 'cate') {
            setFilterQuestion({
                ...filterQuestion,
                cateId: value?.value,
            });
        }
        if (key === 'type') {
            setFilterQuestion({
                ...filterQuestion,
                typeId: value?.value,
            });
        }
        if (key === 'key_word') {
            setFilterQuestion({
                ...filterQuestion,
                search: value,
            });
        }
    }

    const [uploadFileState, setUploadFileState] = React.useState('')
    const [checkValue, setCheckValue] = React.useState(false)
    const upLoadExcelFile = (event) => {
        setUploadFileState(event.target.files[0])
    }
    const changeCheckResult = () => {
        setCheckValue(!checkValue)
        setOpenUpload(!openUpload)
    }
    const onFileUpload = () => { 
        // Create an object of formData 
        let formData = new FormData(); 
       
        // Update the formData object 
        formData.append( 
          "file", 
          uploadFileState, 
          uploadFileState?.name,
        ); 
       
        // Details of the uploaded file 
        importFileExcel(formData)
        .then((res) => {
            if(typeof res.data === "string"){
                toastFail(res.data)
                setOpenUpload(false)
                setCheckValue(true)
            } else if(res.data.code == 400) {
                setOpenUpload(false)
                setCheckValue(true)
            } else {
                toastSuccess("Import file th??nh c??ng");
                getFilterQuestion(filterListQuestion)
                handleCloseDialog();
                setUploadFileState('');
            }
        })
        .catch((err) => {
            setOpenUpload(false)
            setCheckValue(true)
        })
    }

    return (
        <div style={{ marginTop: 20, textAlign: 'left' }}>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Box >
                        <SelectFieldCustom
                            title="Ch??? ?????"
                            data={dataCategory}
                            handleOnChange={handleChangeFilterQuestion}
                            defaultValue={filterQuestion?.cateId ? filterQuestion?.cateId :  ''}
                            name="cate"
                        />
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box >
                        <SelectFieldCustom
                            title="Lo???i c??u h???i"
                            data={dataQuestionType}
                            handleOnChange={handleChangeFilterQuestion}
                            defaultValue={filterQuestion?.typeId ? filterQuestion?.typeId : ''}
                            name="type"
                        />
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box >
                        <InputSearchComponent
                            value={filterQuestion.search}
                            defaultValue={filterQuestion.search || ''}
                            handleChangeText={handleChangeFilterQuestion}
                            title="N???i dung c??u h???i"
                            name="key_word"
                            inputProps={{maxLength: 400}}
                        />
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box >
                        <SearchButton
                            title="T??m ki???m"
                            onClick={() => onClickSearch()}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ margin: '10px 0' }}>
                <CreateButton
                    title="T???o c??u h???i"
                    iconPath="/icon/Add.svg"
                    color="#FFC145"
                    onClick={toggleCreateQuestion}
                />
                <Link to="/quiz/create/quiz/createquiz">
                    <CreateButton
                        title="T???o b??i ki???m tra"
                        iconPath="/icon/CreateTest.svg"
                    />
                </Link>
                <CreateButton
                    title="T???o ch??? ?????"
                    iconPath="/icon/CreateCate.svg"
                    onClick={toggleCreateCateModal}
                />
                <CreateButton 
                    title='Import Excel'
                    onClick={handleClickOpen}
                    iconPath="/icon/ImportExcel.svg"
                />
                {/* <label for="file" style={styles.importBtn}>
                    <i class="fa fa-download" aria-hidden="true"></i>
                    <span>Import file excel</span>
                </label>
                <button onClick={onFileUpload}> 
                  Upload! 
                </button>  */}
            </Box>
            <DialogUploadFille 
                openUpload={openUpload} 
                handleCloseDialog={handleCloseDialog} 
                upLoadExcelFile={upLoadExcelFile} 
                onFileUpload={onFileUpload}
                uploadFileState={uploadFileState}
            />
            <PopupCustom
                type='warning'
                modalStatus={checkValue}
                changeModalStatus={setCheckValue}
                paragraph={[
                    'File c??u h???i ch??a ????ng ?????nh d???ng',
                    'Vui l??ng ki???m tra l???i'
                ]}
                changeCheckResult={changeCheckResult}
            />
        </div>
    );
}

export default HeaderSearch;
