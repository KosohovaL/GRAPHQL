import { IComment } from '../../models/models'

function Comment(props: IComment) {
    console.log(props)
    return (
        <>
            <div className='commentContainer'>
                <div className='comment'>
                    <div className='commentRow'>
                        <div className='commentText'>
                            {props.text}
                        </div>
                        <div className='userName right'>
                            #{props.user.id}
                        </div>
                    </div>
                    <div className='commentRow'>
                        <div className="button">
                            <button className='like bgGr'>&#128077;{props.like}</button>
                            <button className='like bgGr'>&#128078;{props.dislike}</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Comment