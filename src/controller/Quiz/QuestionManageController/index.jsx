/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { apiQuiz } from '../../../api/apiConnect';
import { toastFail, toastSuccess } from '../../../helper/Notification/utils';
import QuestionManageView from '../../../components/Quiz/QuestionManageComponent';
import { getFilterQuestion } from '../../../api/actions';

const QuestionManage = () => {
    const token = localStorage.getItem('token');
    const [filterListQuestion, setFilterListQuestion] = useState({
        page: 1,
        limit: 10,
        // cateId: 0,
        search: '',
    });
    const [categories, setCategories] = useState([]);
    const [nominees, setNominees] = useState([]);
    const [quesTypes, setQuesTypes] = useState([]);
    const [createCateModal, setCreateCateModal] = useState(false);
    const [createNomineeModal, setCreateNomineeModal] = useState(false);
    const [showCreateQuestion, setShowCreateQuestion] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 0,
        total: 0,
    });

    // GET ALL CATEGORY
    const getAllCategories = () => {
        apiQuiz
            .get('/quiz/cate/list', {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // GET ALL NOMINEE
    const getAllNominee = () => {
        apiQuiz
            .get('/quiz/nominee/list', {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setNominees(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // GET ALL QUESTION TYPE
    const getAllQuesType = () => {
        apiQuiz
            .get('/quiz/getAllQuestionType', {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setQuesTypes(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getAllCategories();
        getAllNominee();
        getAllQuesType();
    }, []);

    //POST CREATE CATEGORY
    const toggleCreateCateModal = () => {
        setCreateCateModal(!createCateModal);
    };
    const postCreateCategory = (value) => {
        apiQuiz
            .post('/quiz/createCategory', value)
            .then((res) => {
                toastSuccess('T???o m???i ch??? ????? th??nh c??ng');
                toggleCreateCateModal();
                getAllCategories();
            })
            .catch((err) => {
                toastFail('???? c?? l???i x???y ra !');
            });
    };
    //POST CREATE NOMINEE
    const toggleCreateNomineeModal = () => {
        setCreateNomineeModal(!createNomineeModal);
    };
    const postCreateNominee = (value) => {
        apiQuiz
            .post('/quiz/createnominee', value)
            .then((res) => {
                toastSuccess('T???o Nominee th??nh c??ng');
                toggleCreateNomineeModal();
                getAllNominee();
            })
            .catch((err) => {
                console.log(err);
                toastFail('???? c?? l???i x???y ra !');
            });
    };
    // POST CREATE QUESTION
    const toggleCreateQuestion = () => {
        setShowCreateQuestion(!showCreateQuestion);
    };
    const postCreateQuestion = (value) => {
        apiQuiz
            .post('/quiz/createquestion', value)
            .then((res) => {
                toastSuccess('T???o c??u h???i th??nh c??ng');
                toggleCreateQuestion();
                handleFilterQuestion();
            })
            .catch((err) => {
                console.log(err);
                toastFail('???? c?? l???i x???y ra');
            });
    };
    const handleFilterQuestion = () => {
        const payload = {
            ...filterListQuestion,
        };
        getFilterQuestion(payload)
            .then((res) => {
                setQuestions(res.data.questions);
                setPagination({
                    page: res.data?.page,
                    limit: res.data?.limit,
                    total: res.data?.total,
                });
            })
            .catch((err) => {
                toastFail('L???y danh s??ch c??u h???i th???t b???i');
            });

    }

    useEffect(() => {
        handleFilterQuestion();
    }, [filterListQuestion]);
    // POST EDIT QUESTION
    const [showEditQues, setShowEditQues] = useState(false);
    const toggleEditQues = () => {
        setShowEditQues(!showEditQues);
    };
    return (
        <QuestionManageView
            createCateModal={createCateModal}
            toggleCreateCateModal={toggleCreateCateModal}
            postCreateCategory={postCreateCategory}
            categories={categories}
            nominees={nominees}
            createNomineeModal={createNomineeModal}
            toggleCreateNomineeModal={toggleCreateNomineeModal}
            postCreateNominee={postCreateNominee}
            quesTypes={quesTypes}
            postCreateQuestion={postCreateQuestion}
            questions={questions}
            getFilterQuestion={handleFilterQuestion}
            showCreateQuestion={showCreateQuestion}
            toggleCreateQuestion={toggleCreateQuestion}
            showEditQues={showEditQues}
            toggleEditQues={toggleEditQues}
            pagination={pagination}
            filterListQuestion={filterListQuestion}
            setFilterListQuestion={setFilterListQuestion}
        />
    );
};
export default QuestionManage;
