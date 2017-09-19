import { gql } from 'react-apollo'

export const ALL_QUESTIONS_QUERY = gql`
{
  allQuestions {
    id
    text
    updatedAt
    answers {
      id
      text
      archived
      users {
        id
      }
    }
  }
}
`

export const CREATE_QUESTION_MUTATION = gql`
mutation createQuestionAndAnswers($text: String!, $answers: [QuestionanswersAnswer!]!) {
  createQuestion(
    text: $text,
    answers: $answers,
  ) {
    id
    text
    updatedAt
    answers {
      id
      text
      archived
      users {
        id
      }
    }
  }
}
`

export const UPDATE_QUESTION_MUTATION = gql`
mutation updateQuestionText($id: ID!, $text: String!, $answers: [QuestionanswersAnswer!]!) {
  updateQuestion(
    id: $id,
    text: $text,
    answers: $answers,
  ) {
    id
    text
    updatedAt
    answers {
      id
      text
      archived
      users {
        id
      }
    }
  }
}
`

export const UPDATE_ANSWER_MUTATION = gql`
mutation updateAnswerText($id: ID!, $text: String!, $questionId:ID!, $archived:Boolean!) {
  updateAnswer(id: $id, text: $text, questionId: $questionId, archived: $archived) {
    question {
      id
      text
      updatedAt
      answers {
        id
        text
        archived
        users {
          id
        }
      }
    }
  }
}
`
export const DELETE_QUESTION_MUTATION = gql`
mutation ($questionId: ID!){
  deleteQuestion (id: $questionId) {
    id
  }
}
`

export const DELETE_ANSWER_MUTATION = gql`
mutation ($answerId: ID!){
  deleteAnswer (id: $answerId) {
    id
  }
}
`

export const ARCHIVE_ANSWER_MUTATION = gql`
mutation ($answerId: ID!) {
  updateAnswer(id: $answerId, archived: true) {
    id
  }
}
`
