import React, { useCallback, useEffect, useState } from 'react'
import { isTemplateExpression, isTemplateSpan } from 'typescript'
import { IPost } from '../../models/models'
import Comment from '../Comment/Comment'

function PostItem(props: IPost) {

    return (
        <>
            <div className="post">
                <div className="postRov">
                    <div className="postText">
                        {props.text}
                    </div>
                    <div className="userName">
                        #{props.user.id}
                    </div>
                </div>
                <div className="postRov">
                    <div className="button">
                        <button className='like' onClick={() => props.setLike(props.id)}>&#128077;{props.like}</button>
                        <button className='like' onClick={() => props.setDislike(props.id)}>&#128078;{props.dislike}</button>
                    </div>
                    <button className='myButton'>Reply</button>
                </div>
                {props.comments.map((item) => {
                    return <Comment
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        like={item.like}
                        dislike={item.dislike}
                        user={item.user}
                    />
                })}
            </div>
        </>
    )
}

export default PostItem