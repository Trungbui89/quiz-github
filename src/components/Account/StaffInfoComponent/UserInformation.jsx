/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { postUpdateStaff } from '../../../api/actions';
import {
    convertDateToLocal,
    dataStatusStaffIcon,
} from '../../../constants/shared';
import DatePickerFlexComponent from '../../../helper/DatePickerFlexComponent';
import InputFlexComponent from '../../../helper/InputFlexComponent';
import { toastFail, toastSuccess } from '../../../helper/Notification/utils';
import SelectFieldFlex from '../../../helper/SelectFieldFlex';
import CardHeader from './CardHeader';

export default function UserInformation(props) {
    const {staffInfo, roles, roleInUser,
        postAddRoleToUser,
        deleteUserRole,
        perInUser,
        postAddPerToUser
} = props
    const [userInfor, setUserInfor] = useState({
        id: '',
        fullName: '',
        birthDay: '',
        username: '',
        email: '',
        phone:'',
        address: '',
        userType: '',
    })
    const [isEdit, setIsEdit] = useState(true)
    const history = useHistory()

    const renderDefaultValue = () => {
        if(staffInfo){
            setUserInfor({
                id: staffInfo.id,
                fullName: staffInfo.fullName,
                birthDay: staffInfo.birthDay,
                username: staffInfo.username,
                email: staffInfo.email,
                phone:staffInfo.phone,
                address: staffInfo.address,
                userType: staffInfo.userType,
            })
        }
    }

    const rows = roles?.map((role) => ({ id: role?.id, name: role?.name }));


    useEffect(() => {
        if (staffInfo) {
            renderDefaultValue();
        }
    }, [staffInfo]);

    const checkRoleInUser = (name) => {
        const roleInUserArr = roleInUser?.map((role) => role.name);
        const check = roleInUserArr.includes(name);
        return check;
    };

    const handleUpdateRole = (id) => {
        const roleInUserArr = roleInUser?.map((role) => role.id);
        const check = roleInUserArr.includes(id);
        if (check === true) {
            deleteUserRole(id);
        } else {
            postAddRoleToUser(id);
        }
    };

    const handleClickUpdateStaff = () => {
        postUpdateStaff(userInfor)
            .then(res => {
                toastSuccess('C???p nh???t th??ng tin th??nh c??ng !');
                setIsEdit(true)
            })
            .catch(err => {
                toastFail('???? c?? l???i x???y ra !');
                setIsEdit(false)
            })
    }

    const handleChangeUpdateStaff = (key, value) => {
        switch (key) {
            case 'full_name':
                setUserInfor({ ...userInfor, fullName: value });
                break;
            case 'birthday':
                setUserInfor({ ...userInfor, birthDay: value });
                break;
            case 'email':
                setUserInfor({ ...userInfor, email: value });
                break;
            // case 'username':
            //     setUserInfor({ ...userInfor, username: value });
            //     break;
            // case 'password':
            //     setUserInfor({ ...userInfor, password: value });
            //     break;
            case 'phone':
                setUserInfor({ ...userInfor, phone: value });
                break;
            case 'address':
                setUserInfor({ ...userInfor, address: value });
                break;
            // case 'role':
            //     setUserInfor({ ...userInfor, role: value.value });
            //     break;
            case 'user_type':
                setUserInfor({ ...userInfor, userType: value.value });
                break;
            default:
                break;
        }
    };

    const pushHistory = (id) => {
        history.push(`/admin/staff-list/list-quiz/${id}`)
    }
    return (
        <>
            <Box sx={{ paddingTop: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <div className="my-2 mx-auto avatar-user"></div>
                        <div className="text-center">
                            <button className="button-user">
                                Ch???n ???nh
                            </button>
                        </div>
                        <Grid container spacing={2} style={{paddingTop:'40px'}}>
                            <Grid item xs={4}>
                                <Typography className='title-table-info'>
                                    Ph??n quy???n
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TableContainer component={Paper} >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='title-table-info text-center'>
                                                    Vai tr??
                                                </TableCell>
                                                <TableCell className='title-table-info text-center'>
                                                    H??nh ?????ng
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            onClick={() =>
                                                                handleUpdateRole(row.id)
                                                            }
                                                        >
                                                            {checkRoleInUser(
                                                                row.name,
                                                            ) === true ? (
                                                                <img
                                                                    src="/icon/Unassign.svg"
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <img
                                                                    src="/icon/Assign.svg"
                                                                    alt=""
                                                                />
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>
                        <InputFlexComponent
                            disabled={isEdit}
                            title="H??? v?? t??n"
                            name="full_name"
                            handleChangeText={handleChangeUpdateStaff}
                            value={userInfor.fullName ?? ''}
                        />
                        <DatePickerFlexComponent
                            disabled={isEdit}
                            format='DD/MM/YYYY' 
                            placeholder="Ch???n ng??y" 
                            title='Ng??y sinh'
                            onChange={handleChangeUpdateStaff}
                            value={moment(userInfor.birthDay)}
                            defaultValue={userInfor.birthDay || ''}
                            name="birthday"
                        />
                        <InputFlexComponent
                            disabled={isEdit}
                            type='email'
                            title="Email"
                            name="email"
                            handleChangeText={handleChangeUpdateStaff}
                            value={userInfor.email ?? ''}
                        />
                        <InputFlexComponent
                            disabled={isEdit}
                            type='number'
                            title="S??? ??i???n tho???i"
                            name="phone"
                            handleChangeText={handleChangeUpdateStaff}
                            value={userInfor.phone ?? ''}
                            inputProps={{maxLength:10}}
                        />
                        <InputFlexComponent
                            disabled={isEdit}
                            type='text'
                            title="?????a ch???"
                            name="address"
                            handleChangeText={handleChangeUpdateStaff}
                            value={userInfor.address ?? ''}
                        />
                        <SelectFieldFlex
                            isDisable={isEdit}
                            title="Tr???ng th??i"
                            data={dataStatusStaffIcon}
                            handleOnChange={handleChangeUpdateStaff}
                            defaultValue={userInfor.userType || ''}
                            name='user_type'
                        />
                        <Grid container>
                            <Grid item xs={7} style={{ textAlign: 'right' }}>
                                {isEdit && isEdit === true ? 
                                (<Button className='button-update-user' sx={{marginTop: '20px'}} onClick={()=> setIsEdit(false)}>
                                    Ch???nh s???a
                                </Button>) : 
                                (<>
                                    <Button className='button-save-update' sx={{margin: '20px 20px 0 0'}} onClick={handleClickUpdateStaff}>
                                        l??u
                                    </Button>
                                    <Button 
                                        className='button-update-user' 
                                        sx={{marginTop: '20px'}} 
                                        onClick={() => {renderDefaultValue(); setIsEdit(true)}}>
                                        H???y
                                    </Button>
                                </>)}
                            </Grid>
                            <Grid item xs={5} style={{ textAlign: 'right' }}>
                                <Button className='button-update-user' sx={{marginTop: '20px'}} value={staffInfo ? staffInfo.id : ''} onClick={(e) => pushHistory(e.target.value)}>
                                    Xem b??i ki???m tra
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
                
            </Box>
        </>
    );
}
