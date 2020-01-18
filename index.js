import React from 'react';
import ReactDOM from 'react-dom';

import {TreeComponent,treeOUService} from './components/app';
import './css/main.css';


function callback(as){

    var s = treeOUService.getRoot(as.id)
    
debugger
}
ReactDOM.render(<TreeComponent  onSelectCallback={callback}/>, document.getElementById('treeComponent'));
