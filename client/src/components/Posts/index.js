import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_POSTS, NEW_POST, CREATE_POST, NEW_LIKE, NEW_DISLIKE, GET_USERS } from '../../DB/queries'
import PostItem from '../PostItem'
import { orderBy, orderByName, take } from '../../Constants/constants'

const updateUsersStore = (userId) => (cache, { data: { createPost } }) => {
    const { users } = cache.readQuery({
        query: GET_USERS,
        variables: { orderBy: orderByName },
    });
    const updatedUsers = users.userList.map(item => {
        if (item.id === userId) {
            return {
                ...item,
                posts: [...item.posts, createPost],
            }
        }
        return item
    })

    cache.writeQuery({
        query: GET_USERS,
        variables: { orderBy: orderByName },
        data: { users: { ...users, userList: updatedUsers } },
    });
};

function Posts() {
    const [hidden, setHidden] = useState(true)
    const [countPosts, setCountPosts] = useState(0)
    const [notLoading, setNotLoading] = useState(0)
    const [page, setPage] = useState(1)
    localStorage.setItem('userId', '1')
    const userId = parseInt(localStorage.getItem('userId'))
    const [text, SetText] = useState(' ')
    const skip = 0
    const buttonMore = useRef(null)

    const { loading, error, data, subscribeToMore, fetchMore, search } = useQuery(GET_POSTS, {
        variables: { orderBy, take, skip },
    })

    let posts = []

    let count = 0

    if (data) {
        posts = data.posts.postList.slice(0)
        count = data.posts.count
    }

    const { data: data1 } = useQuery(GET_USERS, {
        variables: { orderBy: orderByName },
    })

    const [updateLike] = useMutation(NEW_LIKE, {
        refetchQueries: [
            { query: GET_POSTS, variables: { orderBy } },
        ]
    })

    const [updateDislike] = useMutation(NEW_DISLIKE, {
        refetchQueries: [
            { query: GET_POSTS, variables: { orderBy } },
        ]
    })

    const [addNewPost] = useMutation(CREATE_POST, {
        update: updateUsersStore(userId),
    })

    useEffect(() => {
        subscribeToMore({
            document: NEW_POST,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const { newPost } = subscriptionData.data;
                return {
                    ...prev,
                    posts: {
                        ...prev.posts,
                        postList: [{ ...newPost, comment: [] }, ...prev.posts.postList],
                    },
                };
            },
        })
    }, [subscribeToMore])

    const setdislike = (id) => {
        updateDislike({
            variables: {
                id: id,
            },
        })
    }

    const setlike = (id) => {
        updateLike({
            variables: {
                id: id,
            },
        })
    }

    const addPost = () => {
        addNewPost({
            variables: {
                post: { userId, text }
            }
        })
    }

    const load = () => {
        const postsCount = data.posts.count
        const pages = Math.ceil(data.posts.count / take)
        let take1 = take
        if ((postsCount - (page + 1) * take) < 5) {
            take1 = postsCount - (page + 1) * take
        }
        fetchMore({
            variables: {
                take: take1,
                skip: page * take,
            },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    return prevResult
                }
                const prevData = prevResult.posts.postList
                const moreData = fetchMoreResult.posts.postList
                fetchMoreResult.posts.postList = [...prevData, ...moreData]
                return fetchMoreResult
            }
        })
        setPage(page => page + 1)
        if (pages === page + 1) {
            buttonMore.current.hidden = "true"
        }
    }

    console.log(posts)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error...</div>;
    }

    return (
        <div className="container">
            <header className='myHeader'>
                <button className='myButton'
                    onClick={
                        (e) => {
                            e.preventDefault()
                            setHidden(false)
                        }}>Add post</button>
            </header>
            {posts.map((item, i) => {
                return <PostItem
                    key={i}
                    id={item.id}
                    createdAt={item.createdAt}
                    text={item.text}
                    like={item.like}
                    dislike={item.dislike}
                    user={item.user}
                    comments={item.comments}
                    setLike={setlike}
                    setDislike={setdislike}
                />
            })}
            <button ref={buttonMore} className='myButton center'
                onClick={(e) => {
                    e.preventDefault()
                    load()
                }}>More</button>
            <div hidden={hidden}>
                <div className="modal">
                    <form className="myForm" autoComplete="off" onSubmit={
                        (e) => {
                            e.preventDefault()
                            if (text.length > 3) {
                                addPost()
                                setHidden(true)
                            }
                        }
                    }>
                        <h1>Add post</h1>
                        <p>Min lenght 3</p>
                        <div className='formRow'>
                            <div className='formCol'>
                                <textarea className='textPost' value={text} required onChange={(e) => SetText(e.target.value)}></textarea>
                            </div>
                            <div className='formCol'>
                                <button className='myButton cancel'
                                    onClick={
                                        (e) => {
                                            e.preventDefault()
                                            setHidden(true)
                                        }}>
                                    &#10008;
                                </button>
                                <button className='myButton send'>Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Posts