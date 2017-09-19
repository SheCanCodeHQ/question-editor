import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {
  ALL_QUESTIONS_QUERY,
  DELETE_QUESTION_MUTATION,
  DELETE_ANSWER_MUTATION,
  UPDATE_QUESTION_MUTATION,
  UPDATE_ANSWER_MUTATION,
} from './mutations'
import {timeDifferenceForDate} from './utils'
import CreateQuestion from './CreateQuestion'

class Question extends Component {
  state = {
    editing: false
  }

  render() {
    if (this.state.editing) {
      return (<CreateQuestion
        question={this.props.question}
        updateQuestion={(data) => this._updateQuestion(data)}
      />)
    }
    return (
      <div className="QuestionCard">
        <div className="QuestionHeader">
          <div className="Question">
            {this.props.question.text}
          </div>
          <div className="updatedAt">
            {' updated '}
            {timeDifferenceForDate(this.props.question.updatedAt)}
          </div>
        </div>
        <div className="Answers">
          {this.props.question.answers.map(
            (answer) => (<Answer key={answer.id} {...answer}/>)
          )}
        </div>
        <div className="QuestionButtons">
          <button onClick={() => this._deleteQuestion(this.props.question)}>Delete</button>
          <button onClick={() => this._editQuestion(this.props.question)}>Edit</button>
        </div>
      </div>
    );
  }

  async _deleteQuestion(question) {
      // don't delete questions that have been answered before
      // archive questions if you don't want users to see them any more
      // TODO: add undo banner for deleted questions
      let answerDeletions = question.answers.map(
        ({id}) => this.props.deleteAnswerMutation({
          variables: {
            answerId: id,
          }
        })
      );
      let questionDeletion = this.props.deleteQuestionMutation({
        variables: {
          questionId: question.id,
        },
        update: (store, { data: {errors} }) => {
          if (errors && errors.length > 0){
            errors.map((e) => console.error(e.message + ' (' + e.code + ')'))
            return;
          }
          const data = store.readQuery({
            query: ALL_QUESTIONS_QUERY
          })
          data.allQuestions = data.allQuestions.filter(
            ({id}) => (id !== question.id)
          )
          store.writeQuery({
            query: ALL_QUESTIONS_QUERY,
            data,
          })
        }
      })
      await Promise.all([questionDeletion, ...answerDeletions]);
  }

  _editQuestion(question) {
    this.setState({ editing: true })
  }

  async _updateQuestion(data) {
    // update the question text + add new answers
    const {questionId, text, answers} = data
    const newAnswers = answers.filter((a) => (a.id === undefined))
    const oldAnswers = answers.filter((a) => (a.id !== undefined))
    await this.props.updateQuestionMutation({
      variables: {
        id: questionId,
        text,
        answers: newAnswers,
      }
    });
    // reattach previous answers and update their text and archived status
    let answerUpdates = oldAnswers.map(
      ({id, text, archived}) => this.props.updateAnswerMutation({
        variables: {
          id,
          text,
          archived,
          questionId: questionId,
        },
      })
    );
    await Promise.all([answerUpdates])
    this.setState({ editing: false })
  }
}

const Answer = (answer) => (
  <div className="Answer">
    <span className={answer.archived ? 'Archived' : ''}> {answer.text} </span>
    <span className="Count">(chosen by {answer.users.length} users)</span>
  </div>
);

export default compose(
  graphql(DELETE_QUESTION_MUTATION, { name: 'deleteQuestionMutation' }),
  graphql(DELETE_ANSWER_MUTATION, { name: 'deleteAnswerMutation' }),
  graphql(UPDATE_QUESTION_MUTATION, { name: 'updateQuestionMutation' }),
  graphql(UPDATE_ANSWER_MUTATION, { name: 'updateAnswerMutation' }),
)(Question)
