import React,{propTypes} from 'react';
import collapseIMG from '../images/collapse.png';
import expandIMG from '../images/expand.png';
import transparentIMG from '../images/transparent.gif';
import loaderIMG from '../images/ajax-loader-bar.gif';

var ouMap = [];
var rootOU = null;

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
            rootOU = body.organisationUnits[0];

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
        ouMap[t.id]=t;

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
            
            t.children.map(function(tc){
                tc.parent = t;
                traverseTree(tc)
            })
            
        }else{
            return
        }    
    }
    
}

export const treeOUService = {
    
    getOrgUnitFromUID : function(uid){
        
        try{
            return Object.assign({},ouMap[uid]);
        }catch(e){
            console.log(e);
            return null
        }
    },
    getRoot : function(){
        try{
            return Object.assign({},ouMap[rootOU.id]);
        }catch(e){
            console.log(e);
            return null
        }    }
    
}

export function TreeComponent(props){

    var instance = Object.create(React.Component.prototype)

    var state = {
        _state : {
            previousSelected :{},
            unselectPrev : function(){},
            onSelectCallback : props.onSelectCallback
        }
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
        if (!state.data){return (<div key = "dummy">
                                 <img  height="12" width="12" src={loaderIMG}  />
                                 </div>
                                )}
        
        return <div>
            <Tree data={state.data} state={state._state}  />
            </div>
    }

    
    return instance;

    function Tree(props){
        var instance = Object.create(React.Component.prototype)
        
        instance.props = props;

        function getLeaf(data,state){
            var toggleImg = expandIMG;

            if (data instanceof Array){
                var leafs = data.reduce(function(list,obj){                    
                    list.push(<Leaf key={"leaf_"+obj.id} data={obj} state={state} />);
                    return list;
                },[]);

                return leafs;
            }else{
                
                return (<Leaf key={"leaf_"+data.id} data={data} state={state} />);
            }
        }
        
        instance.render = function(){
            return (<ul>
                    {getLeaf(props.data,props.state)}
                    </ul>)
        }

        return instance;
    }
    function Leaf(props){
        var instance = Object.create(React.Component.prototype)
        instance.props = props;
        var data = props.data; 
       
        function toggle(){
            data.showChildren = !data.showChildren;
            instance.setState(data);
        }

        function unselect(){
            data.selected = false;
            instance.setState(data);
        }
        
        function selectOU(e){
            props.state.unselectPrev();
            props.state.unselectPrev = unselect;
            data.selected = true;
            instance.setState(data);
            props.state.onSelectCallback(
                Object.assign({},
                              {
                                  id:data.id,
                                  level:data.level,
                                  name:data.name
                              }));
            
        }
        
        function node(){
            if (data.children.length!=0){
                return (
                        <li id={data.id} key={'li'+data.id}>
                        <span key={"span_"+data.id} className="toggle"   > 
                        <img key={"img_"+data.id} height="12" width="12" src={props.data.showChildren  ?collapseIMG:expandIMG} onClick={toggle} />
                        </span>
                        <a key={"a_"+data.id} onClick={selectOU} className={props.data.selected? "selected":""} >{data.name}</a>
                        <div key={"div"+data.id+data.children.length} className={data.showChildren ?'show':'hide'}>
                        <Tree key={"tree"+data.id+data.children.length} data={data.children} state={props.state} />
                        </div>
                        
                    </li>
                )    
            }else{
                return (
                        <li id={data.id} key={'li'+data.id}>
                        <a key={"a_"+data.id} onClick={selectOU} className={props.data.selected? "selected":""} >{data.name}</a>
                        
                    </li>
                )    
            }
        }
        
        
        instance.render = node;
        
        return instance;
    }

}  
