import React,{propTypes} from 'react';
import collapseIMG from '../images/colapse.png';
import expandIMG from '../images/expand.png';

function getReq(url,callback){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            callback(null,request,data);
        } else {
            // We reached our target server, but it returned an error
            callback(request,null,null);

            
        }
    };
    
    request.onerror = function(e) {        
        // There was a connection error of some sort
        callback(e,null,null);

    };
    
    request.send();
    
}

function init(callback){
    
    getReq("../../me.json?fields=id,name,organisationUnits[id,name,level]",function(error,response,body){
        if (error){
            callback(error)
        }else{
            var rootOU = body.organisationUnits[0];

            getReq("../../organisationUnits/"+rootOU.id+".json?fields= id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[]]]]]]]]]]]]]]]]]]",
                   function(error,reponse,body){
                       if (error){
                           callback(error)
                       }else{
                           traverseTree(body);

                           callback(body)
                       }
                   })
            
        }
        
    })

    function traverseTree(t){
        
        if (t.children){
            t.showChildren=false;
            t.selected = false;
            t.children.map(function(t){
                traverseTree(t)
            })
            
        }else{
            return
        }    
    }
    
}

export function TreeComponent(props){

    var instance = Object.create(React.Component.prototype)

    var state = {
        previousSelected :{},
        onSelectCallback : props.onSelectCallback
    }
    instance.props = props;   
    var toggle = function(){
        instance.setState(state.data)
    }
    instance.updateState = function(){
        instance.setState(Object.assign({},state))

    }

    if (!props.data){
        init(function(ous){
            state.data = ous;
            instance.setState(state)
            
        });
    }
    instance.render = function(){
        if (!state.data){return <div key = "dummy"></div>}
        
        return <ul key={"ul_"+state.data.id}>
            <Tree data={state.data} updateState={instance.updateState} state={state } />
            </ul>
    }

    
    return instance;

    
    function Tree(props){
        var instance = Object.create(React.PureComponent.prototype)

        instance.render = function(){
            if (!props.data.children || props.data.children.length == 0){
                return (
                        <li key={"li_"+props.data.id}>
                        <LeafNode data={props.data} updateState = {props.updateState} state={props.state}  />                
                        </li>
                )
            }

            return  (            
                    <li key={"li_"+props.data.id}><LeafNode data={props.data} updateState = {props.updateState} state={props.state} />
                    <ul key = {"ul_"+props.data.id} style={props.data.showChildren?{"display":"inline"}:{"display":"none"}}>
                    {
                        props.data.children.map(function(child){
                            return <Tree data={child} key={"tree_"+child.id} updateState = {props.updateState} state={props.state}  />
                        })                
                    }
                </ul></li>
            )
        }
        return instance;
        function LeafNode(props){
            var instance = Object.create(React.PureComponent.prototype)
            instance.props = props;   

        /*    instance.shouldComponentUpdate = function(nextProps) {
                return (nextProps.data.showChildren !== this.props.data.showChildren);
            }
        */
            instance.componentDidMount= function(){
                  console.log("yes")
            }
            
            instance.toggle = function(){

                props.data.showChildren = !props.data.showChildren;
                props.updateState();
            }

            instance.selected = function(){
                props.state.previousSelected.selected = false;
                props.data.selected = !props.data.selected;                
                props.state.previousSelected = props.data;
                props.updateState();
                props.state.onSelectCallback(Object.assign({},props.data));
                
            }
            
            instance.render = function(){
                var toggleImg = "";
                
                if ( props.data.children.length!=0){
                    toggleImg = props.data.showChildren  ?expandIMG:collapseIMG; 
                }            
                return (
                        <div key={"div_"+props.data.id} >
                        <span key={"span_"+props.data.id} className="toggle"  >
                        <img key={"img_"+props.data.id} width="12" height="12" src={toggleImg} onClick={instance.toggle} />
                        </span>
                        <a key={"a_"+props.data.id} onClick = {instance.selected} style={props.data.selected? {color:"yellow"}:{color:"black"}}  >{props.data.name}</a>
                        </div>
                )
            }
            return instance        
        }   
    }
}
