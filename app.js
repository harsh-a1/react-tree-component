import React,{propTypes} from 'react';
import collapseIMG from './images/collapse.png';
import expandIMG from './images/expand.png';
import transparentIMG from './images/transparent.gif';
import loaderIMG from './images/ajax-loader-bar.gif';

import  './css/main.css'
// TODO This file needs to be gotten rid of
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
            t.children.sort(function(a,b){
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                                          
                // names must be equal
                return 0;
            })
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
        onSelectCallback : props.onSelectCallback,
        loading:true
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
            state.loading = false;
            instance.setState(state)
            
        });
    }
    instance.render = function(){
        if (!state.data){return <div key = "dummy">  <img  height="12" width="12" src={loaderIMG} ></img></div>}
        
        return <div key = "treeContainer">
            <ul key={"ul_"+state.data.id}>
            <Tree data={state.data} updateState={instance.updateState} state={state } />
            </ul>

            <img  height="32" width="32" src={loaderIMG} style = {state.loading?{"display":"inline"} : {"display" : "none"}}></img>
            </div>
    }

    
    return instance;

    
    function Tree(props){
        var instance = Object.create(React.PureComponent.prototype)

        instance.props = props;
        
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

            instance.componentDidMount= function(){
//                  console.log("yes")
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
                props.state.onSelectCallback.selected(Object.assign({},props.data));
            
                
            }
            
            instance.render = function(){
                var toggleImg = "";
                
                if ( props.data.children.length!=0){
                    toggleImg = props.data.showChildren  ?collapseIMG:expandIMG; 
                }            
                return (
                        <div key={"div_"+props.data.id} >
                        <span key={"span_"+props.data.id} className="toggle"  > 
                        <img key={"img_"+props.data.id} height="11" width="11" src={toggleImg} onClick={instance.toggle} />
                        </span>
                        <a key={"a_"+props.data.id} onClick = {instance.selected} className={props.data.selected? "selected":""}  >{props.data.name}</a>
                        </div>
                )
            }
            return instance        
        }   
    }
}
