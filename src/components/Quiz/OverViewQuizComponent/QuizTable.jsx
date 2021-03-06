import React from 'react';
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { convertDateTime12hours, convertUTCDateStringToLocal } from '../../../constants/shared'
import { checkStatusQuiz } from '../../../constants/shared'
import PopupCustom  from '../../../helper/PopupCustom'

export default function QuizTable(props) {
    const {
        listQuiz,
        changeQuizStatus,
        pagination
    } = props;

    let adminLinkTo = '/'
    const history = useHistory()
    const role = localStorage.getItem('roleId')

    const [checkQuizStatus, setCheckQuizStatus] = React.useState(false)
    const [checkDoingStatus, setCheckDoingStatus] = React.useState(false)
    const [checkStartTime, setCheckStartTime] = React.useState(false)

    const pushHistory = (value, quiz) => {
        // console.log(moment.utc(quiz.startTime).diff(moment.utc(), 'seconds'))
        localStorage.getItem('roleId') == 1
        ?
            (quiz.status === 'not_start' || quiz.status === 'doing' || quiz.status === 'expired')
            ?
                changeQuizStatus()
            :
                history.push(value.target.value)
        :
            quiz.status === 'done' || quiz.status === 'not_start'
            ?
                history.push(value.target.value)
            :
                quiz.status === 'expired'
                ?
                    setCheckQuizStatus(!checkQuizStatus)                       
                :
                    quiz.status === 'doing'
                    &&
                        moment().diff(moment(quiz.userStartQuiz), 'seconds') >= quiz.quizTime*60
                        ?
                            setCheckDoingStatus(!checkDoingStatus)
                        :
                            history.push(value.target.value)

    }

    const RenderQuizzes = () => {

        return listQuiz.map((quiz, index) => {
            Number(role) !== 1 ? adminLinkTo = `/list-test/take-quiz/start/${quiz.id}&${index}` : adminLinkTo = `/admin/staff-list/list-quiz/finish/${quiz.id}&${index}`
            return (
                <tr key={index} style={{ height: '60px', position: 'relative' }}>
                    <td className='text-center'>{(Number(pagination.page) - 1)*(pagination.limit) + index + 1}</td>
                    <td className='text-left' style={{ paddingLeft: '50px' }}>{quiz.description}</td>
                    <td className='text-center'>{quiz.numberQuestions}</td>
                    <td className='text-center'>{quiz.quizTime}</td>
                    <td className='text-center'>{convertDateTime12hours(quiz.startTime)}</td>
                    <td className='text-center'>{convertDateTime12hours(quiz.expiredTime)}</td>
                    <td>
                        {
                            quiz.status == 'doing'
                            ?
                                moment().diff(moment(quiz.userStartQuiz), 'seconds') >= quiz.quizTime*60
                                ?
                                    checkStatusQuiz('quitted')
                                :
                                    checkStatusQuiz('doing')
                            :
                                checkStatusQuiz(quiz.status)
                        }
                    </td>
                    <td>
                        <button
                            onClick={(value) => pushHistory(value, quiz)}
                            value={adminLinkTo}
                            style={{
                                height: '60px',
                                width: '100%', 
                                position: 'absolute', 
                                zIndex: 9, 
                                cursor: 'pointer', 
                                top: 0, 
                                left: 0,
                                border: 'none',
                                background: 'none',
                            }}
                        />
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <table className="mt-3 card__table">
                <thead>
                    <tr>
                        <th className='text-center'>STT</th>
                        <th className='text-center'>T??n b??i ki???m tra</th>
                        <th className='text-center'>S??? c??u h???i</th>
                        <th className='text-center'>Th???i gian l??m b??i</th>
                        <th className='text-center'>Th???i gian m???</th>
                        <th className='text-center'>Th???i gian h???t h???n</th>
                        <th className='text-center'>Tr???ng th??i</th>
                    </tr>
                </thead>
                <tbody className="">
                    <RenderQuizzes />
                </tbody>
            </table>
            <PopupCustom
                type = 'warning'
                paragraph = {[
                    'B??i ki???m tra ???? h???t h???n'
                ]}
                buttons = {['Quay l???i']}
                quizStatus={checkQuizStatus}
                changeQuizStatus={setCheckQuizStatus}
            />
            <PopupCustom
                type = 'warning'
                paragraph = {[
                    'B??i ki???m tra ???? h???t h???n'
                ]}
                buttons = {['Quay l???i']}
                quizStatus={checkDoingStatus}
                changeQuizStatus={setCheckDoingStatus}
            />
            <PopupCustom
                type = 'warning'
                paragraph = {[
                    'Ch??a t???i th???i gian l??m b??i'
                ]}
                buttons = {['Quay l???i']}
                quizStatus={checkStartTime}
                changeQuizStatus={setCheckStartTime}
            />
        </>
    )
}

