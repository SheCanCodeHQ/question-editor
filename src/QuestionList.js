import React, { Component } from 'react'
import Question from './Question';
import CreateQuestion from './CreateQuestion'
import { graphql } from 'react-apollo'
import { ALL_QUESTIONS_QUERY } from './mutations'
import './Question.css';

class QuestionList extends Component {

  render() {

    if (this.props.allQuestionsQuery && this.props.allQuestionsQuery.loading) {
      return (<div className="Loading">Loading...</div>)
    }

    if (this.props.allQuestionsQuery && this.props.allQuestionsQuery.error) {
      return (<div>Error</div>)
    }

    const questionsToRender = this.props.allQuestionsQuery.allQuestions
    return (
      <div>
        <div className="QuestionList">
        {questionsToRender.map(question => (
          <Question key={question.id} question={question}/>
        ))}
        <CreateQuestion />
        </div>
      </div>
    )
  }
}

export default graphql(ALL_QUESTIONS_QUERY, { name: 'allQuestionsQuery' }) (QuestionList)
