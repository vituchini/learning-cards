import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../bll/store';
import {addCardTC, getCardsTC, searchQuestionAC} from '../../bll/reducers/cards-reducer';
import {useNavigate, useParams} from 'react-router-dom';
import {CardsTable} from './CardsTable';
import {Button} from '@mui/material';
import styles from './Cards.module.css'
import {useDebounce} from '../../hooks/useDebounce';
import {Search} from '../../components/Search/Search';

export const Cards = () => {
    const dispatch = useAppDispatch()
    const {packId, packName} = useParams()
    const page = useAppSelector(state => state.cards.params.page)
    const pageCount = useAppSelector(state => state.cards.params.pageCount)
    const userId = useAppSelector(state => state.profile._id)
    const packUserId = useAppSelector(state => state.cards.packUserId)
    const navigate = useNavigate()

    const [value, setValue] = useState('')

    const debouncedValue = useDebounce(value, 1000)

    const addCard = () => {
        const question = 'HARDCODE QUESTION'
        const answer = 'HARDCODE ANSWER'
        if (packId) {
            dispatch(addCardTC(packId, question, answer))
        }
    }

    const searchQuestionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
        dispatch(searchQuestionAC(e.currentTarget.value))
    }

    const onClickBackHandler = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (packId) {
            dispatch(getCardsTC(packId))
        }
    }, [dispatch, packId, packName, page, pageCount, debouncedValue])

    return (
        <div className={styles.wrapper}>
            <div onClick={onClickBackHandler} className={styles.backButton}>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 5.5H2M2 5.5L6.66667 1M2 5.5L6.66667 10" stroke="black" strokeWidth="2"/>
                </svg>
                <div className={styles.back}>Back to Packs List</div>
            </div>
            {userId === packUserId
                ? <div className={styles.header}>
                    <div>{packName}</div>
                    <div>
                        <Button variant={'contained'} onClick={addCard}>Add new card</Button>
                    </div>
                </div>
                : <div className={styles.packName}>{packName}</div>}
            <div className={styles.search}>
                <div>Search</div>
                <div className={styles.searchLine}>
                    <Search value={value} onChange={searchQuestionHandler}/>
                </div>
            </div>
            <div className={styles.table}>
                <CardsTable/>
            </div>
        </div>
    );
};