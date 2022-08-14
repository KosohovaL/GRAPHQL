export interface IComment {
    id: number;
    text: string;
    like: number;
    dislike: number;
    user: {
        id: number
    };
}

export interface IPost {
    id: number;
    createdAt: Date;
    text: string;
    like: number;
    dislike: number;
    comments: IComment[]
    user: {
        id: number
    };
    setLike: (id: number) => void;
    setDislike: (id: number) => void;
}
