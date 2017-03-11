import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchJoke, markAsFavorite } from './actions';


const stateToProps = ({ test }) => test;
const dispatchToProps = dispatch => bindActionCreators({ fetchJoke, markAsFavorite}, dispatch);

export default connect(stateToProps, dispatchToProps)(class extends React.Component {

  static needs = [
    fetchJoke
  ]

  render() {
    const { joke, isLoading, isError, favorite } = this.props;
    return (
      <div className="chuckle-at-chuck">
        <div className="favorite" style={{ color: '#5baec7' }}>
          <strong>>FAVORITE JOKE:</strong> <em>{favorite}</em>
        </div>
        <div className="current-joke">
          <strong>>CURRENT JOKE:</strong>           
          { (() => {
            switch (true) {
              case isError:
                return <span class="error">Something Went Wrong!</span>;
              case isLoading:
                return <span class="loader">Loading Please Wait!</span>;            
              default:
                return (
                  <em>
                    {joke} 
                    <div className="actions">
                      <button onClick={this.props.markAsFavorite}>Favorite</button> 
                      <button onClick={this.props.fetchData}>Next Joke</button>
                    </div>
                  </em>
                );
            }
          })()}          
        </div>
      </div>
    )
  }

})