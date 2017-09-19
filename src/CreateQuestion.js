import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import { ALL_QUESTIONS_QUERY, CREATE_QUESTION_MUTATION, ARCHIVE_ANSWER_MUTATION } from './mutations'

class CreateQuestion extends Component {

  _getInitialState() {
    if (this.props.question) {
      const answers = this.props.question.answers.map(
        ({id, text, archived}) => ({id, text, archived}) // copy fields
      )
      return {
        text: this.props.question.text,
        answers,
      }
    }
    return {
      text: '',
      answers: [
        {
          text: '',
        }
      ]
    }
  }

  componentWillMount() {
    this.setState(this._getInitialState())
  }

  async _createQuestion() {
    const { text, answers } = this.state
    await this.props.createQuestionAndAnswers({
      variables: {
        text,
        answers
      },
      update: (store, { data: {createQuestion, errors} }) => {
        if (errors && errors.length > 0){
          errors.map((e) => console.error(e.message + ' (' + e.code + ')'))
          return;
        }
        const data = store.readQuery({
          query: ALL_QUESTIONS_QUERY
        })
        data.allQuestions.push(createQuestion)
        this.setState(this._getInitialState())
        store.writeQuery({
          query: ALL_QUESTIONS_QUERY,
          data,
        })
      }
    })
  }

  async _updateQuestion() {
    const { text, answers } = this.state
    const questionId = this.props.question.id
    this.props.updateQuestion({ questionId, text, answers })
  }

  _addAnswer() {
    this.setState( (prevState) => prevState.answers.push({text:''}))
  }

  _deleteAnswer(index) {
    this.setState((prevState) => prevState.answers.splice(index, 1))
  }

  async _toggleAnswer(id) {
    this.setState((prevState) => prevState.answers.map(
      (a) => ((a.id === id) ? a.archived = !(a.archived) : a)
    ))
  }

  render() {
    const isQuestionValid = (
      this.state.text.trim().length > 1
      && this.state.answers.length > 0
      && this.state.answers.every((a) => a.text.trim().length > 0)
    )
    const existingQuestion = !!(this.props.question)
    return (
      <div className="QuestionCard CreateQuestion">
        <div className="QuestionHeader">
          <input
            className="QuestionTextInput"
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
            type='text'
            placeholder='A new question'
          />
        </div>
        <div className="Answers">
          {this.state.answers.map(
            (answer, index) => (
              <div key={index} className="InputAnswer">
                <input
                  className={answer.archived ? 'Archived' : ''}
                  disabled={answer.archived}
                  value={answer.text}
                  onChange={(e) => {
                    const text = e.target.value;
                    this.setState((prevState) => {
                      let answers = prevState.answers.slice();
                      answers[index].text = text;
                      return {...prevState, answers}
                    })
                  }}
                  type='text'
                  placeholder='A new answer'
                />
                {answer.id !== undefined ?
                  <button onClick={() => this._toggleAnswer(answer.id)}>{answer.archived ? 'Restore Answer' : 'Archive Answer'}</button> :
                  <button onClick={() => this._deleteAnswer(index)}>Remove Answer</button>
                }
              </div>
            )
          )}
          <button onClick={() => this._addAnswer()}>Add Answer</button>
        </div>
        <div className="QuestionSave">
          <button onClick={
            existingQuestion ?
            () => this._updateQuestion() :
            () => this._createQuestion()
          } disabled={!isQuestionValid}
          >
            Save
          </button>
          <span className="Warning"> {!isQuestionValid ? 'question/answer text cannot be empty' : ''} </span>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(CREATE_QUESTION_MUTATION, { name: 'createQuestionAndAnswers' }),
  graphql(ARCHIVE_ANSWER_MUTATION, { name: 'archiveAnswer' }),
)(CreateQuestion)
