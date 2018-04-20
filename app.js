import React,{propTypes} from 'react';
import ReactDOM from 'react-dom';
import collapseIMG from './images/collapse.png';
import expandIMG from './images/expand.png';
import transparentIMG from './images/transparent.gif';
import loaderIMG from './images/ajax-loader-bar.gif';

import  './css/main.css'


window.onload = function(){
    ReactDOM.render(<HeaderBar  />, document.getElementById('headerBar'));
}
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
    
    getReq("../../../dhis-web-commons/menu/getModules.action",function(error,response,body){
        if (error){
            callback(error)
        }else{
            var modules = body.modules;
            callback(modules);
          
            
        }
        
    })
    
}


export function HeaderBar(props){

    var instance = Object.create(React.Component.prototype)

    var state = {
        modules : null,
        showItems:true
    }
    instance.props = props;   
    var toggle = function(){
        instance.setState(state.data)
    }
    instance.updateState = function(){
        instance.setState(Object.assign({},state))

    }

    if (!props.data){
        init(function(modules){
            state.modules = modules;
            instance.setState(state);
        });
    }
    
    instance.render = function(){

        function toggleItems(e){
            state.showItems = !state.showItems
            instance.setState(state);
            
        }
        
        if (!state.modules){return <div key = "dummy">  <img  height="12" width="12" src={loaderIMG} ></img></div>}
        
        return( <div key = "header">
                <img className="header-logo" src="../../../api/staticContent/logo_banner" id="headerBanner" title="** view_home_page **" ></img>
                
                <div id = "iconBox" style={state.showItems?{"display":"flex"}:{"display":"none"}}>
               
                <div id="searchDiv1">Search apps</div>
                <hr id="hrSearch"></hr>
                <input type="text" value="" id="undefined-Searchapps-undefined-62712" id="inputHeader" ></input>
                <button id="box-button" onClick={toggleItems} type="button">
                <div><svg id="svgBox" viewBox="0 0 24 24" ><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg></div>
                </button>

                <ModuleIcon modules={state.modules}/>
                </div>
                </div>
               
              )
    }

    
    return instance;
}

function ModuleIcon(props){

    var instance = Object.create(React.Component.prototype);

    function getModuleIcon (){
        
        var list = props.modules.reduce((list,obj)=>{

            list.push(ItemBox(obj))
            return list;
        },[]);
        
        return list;

        function ItemBox(item){
            var base_url = "../../";

            if (!item.name.startsWith("dhis")){
                base_url="";
            }
            
            return (<a href={base_url+item.defaultAction} className="itemLink">
                    <div  ><img src={base_url+item.icon} height= "48px" width= "48px"></img></div>
                    <div id="textDiv" >{item.displayName}</div></a>
            )
        }
    }
    
    instance.render = function(){
        
        return (
             <div id="iconBox2" >
                <div id="iconBox3">
                {getModuleIcon()}
            </div>
                </div>
                      
               )
    }

    return instance;
}
    
