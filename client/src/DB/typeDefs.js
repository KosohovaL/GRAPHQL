
import { gql } from '@apollo/client';

export const typeDefs = gql`
    enum Sort {
        asc
        desc
    }
    
    # input PostOrderByInput {
    #     : Sort
    #     id: Sort
    # }
    
    input UserInput {
        name: String!
        email: String!
    }   

    input PostInput {
        text: String!
        like: Int!
        dislike: Int!
    }
`;