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
        return <ul key={"ul_"+props.data.id}>
            <Tree data={props.data} toggle={toggle}/>
                </ul>
    }

    return instance;

    
    function Tree(props){
        var instance = Object.create(React.PureComponent.prototype)

        instance.render = function(){
        if (!props.data.children){
            return (
                    <li key={"li_"+props.data.id}>
                    <LeafNode data={props.data} toggle = {props.toggle}/>                
                    </li>
            )
        }
        
        return  (            
                <li key={"li_"+props.data.id}><LeafNode data={props.data} toggle = {toggle} />
                <ul key = {"ul_"+props.data.id} >{
                    
                   props.data.showChildren && props.data.children.map(function(child){
                        return <Tree data={child} key={"tree_"+child.id} />
                    })                
                }
            </ul></li>
        )
        }
        return instance;
        function LeafNode(props){
            var instance = Object.create(React.PureComponent.prototype)
            instance.props = props;   

            instance.componentDidMount= function(){
                console.log("yes")
            }
          
            instance.toggle = function(){

                props.data.showChildren = !props.data.showChildren;
                props.toggle();
            }
            instance.render = function(){
                var toggleImg = "";
                
                if (props.data.children){
                    toggleImg = props.data.showChildren  ?"./images/expand.png":"./images/colapse.png"; 
                }            
                return (
                        <div key={"div_"+props.data.id}>
                        <span key={"span_"+props.data.id} className="toggle"  >
                        <img key={"img_"+props.data.id} width="9" height="9" src={toggleImg} onClick={instance.toggle} />
                        </span>
                        <a key={"a_"+props.data.id} href="">{props.data.name}</a>
                        </div>
                )
            }
            return instance        
        }   
    }
}
