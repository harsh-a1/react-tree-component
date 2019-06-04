import React from 'react';
import ReactDOM from 'react-dom';

import {TreeComponent} from './components/tree';
import './css/main.css';

ReactDOM.render(<TreeComponent  onSelectCallback={function(){}}/>, document.getElementById('treeComponent'));

