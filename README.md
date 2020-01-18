# dhis2-ou-tree

npm install dhis2-ou-tree

```javascript

import {TreeComponent} from 'dhis2-ou-tree';

ReactDOM.render(<TreeComponent  onSelectCallback={OUcallback}/>, document.getElementById('treeComponent'));

function OUcallback(obj){
  // click on ou to mark it as selected and this event will fire up.
}
```
