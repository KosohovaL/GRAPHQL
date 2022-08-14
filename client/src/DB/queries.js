import { gql } from '@apollo/client'

export const GET_POSTS = gql`
    query getPosts($orderBy: PostOrderByInput!, $take: Int , $skip: Int) {
        posts(orderBy: $orderBy take: $take skip:$skip) {
            postList {
                id
                createdAt
                text
                user {
                    id
                }
                like
                dislike
                comments {
                    id
                    text
                    user {
                        id
                    }
                }
            }
            count
        }
    }
`;

export const CREATE_POST = gql`
    mutation createPost($post: PostInput!) {
        createPost(post: $post) {
            id
            text
        }
    }
`;

export const NEW_POST = gql`
    subscription newPost {
        newPost {
        id
        createdAt
        text
        user {
            id
        }
        like
        dislike
        }
    }
`;

export const NEW_LIKE = gql`
    mutation updateLike($id: Int!){
        updateLike(id: $id) {
            id
  }
}
`;

export const NEW_DISLIKE = gql`
    mutation updateDislike($id: Int!){
        updateDislike(id: $id) {
            id
  }
}
`;

export const GET_USERS = gql`
    query getUsers($orderBy: UserOrderByInput!) {
        users(orderBy: $orderBy) {
            userList {
                id
                createdAt
                email
                name
                posts {
                    id
                    text
                }
            }
            count
        }
    }
`;

export const ADD_LIKE = gql`
    subscription newLike {
        like
    }
`;
