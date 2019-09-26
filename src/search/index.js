import React from 'react';
import ReactDOM from 'react-dom';
import './search.scss';
import logo from './images/qcode.png';

class Search extends React.Component{

    render () {
        return <div class="searchText">
            Search <span class="text">React</span> Demo2222 <img src={ logo } />
            </div>
    }
};

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);