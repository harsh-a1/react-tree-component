import React,{propTypes} from 'react';

export function UploadFile(props){
    return (
            <div>
            <label>Upload .xlsx/csv file</label>
            <input type="file" id="fileInput"/>
            <button onClick={props.onClick}>Import</button>
            </div>
    )
}


export function TreeComponent(props){

    var instance = Object.create(React.Component.prototype)

    
    instance.props = props;   
    var toggle = function(){
        instance.setState(props.data)
    }
    instance.render = function(){
        return <ul>
            <Tree data={props.data} toggle={toggle}/>
                </ul>
    }

    return instance;

    
    function Tree(props){

       
        if (!props.data.children){
            return (
                    <li>
                    <LeafNode data={props.data} toggle = {props.toggle}/>                
                    </li>
            )
        }
        
        return  (            
                <li><LeafNode data={props.data} toggle = {toggle} />
                <ul>{
                    props.data.children.map(function(child){
                        return <Tree data={child} />
                    })
                }
            </ul></li>
        )
        
        function LeafNode(props){

            function toggle(){

                props.data.showChildren = !props.data.showChildren;
                props.toggle();
            }
            
            var toggleImg = "";

            if (props.data.children){
                toggleImg = props.data.showChildren  ?"./images/colapse.png":"./images/expand.png"; 
            }            
            return (
                    <div>
                    <span className="toggle"  >
                    <img width="9" height="9" src={toggleImg} onClick={toggle} />
                    </span>
                    <a href="">{props.data.name}</a>
                    </div>
            )
        }   
    }
}
