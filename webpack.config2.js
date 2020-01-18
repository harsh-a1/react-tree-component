var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, './');

module.exports = {
  
    entry: [
        path.join(parentDir, './components/tree.js')
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },            
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            name: "[name][md5:hash].[ext]"
                          
                        }
                    }    
                ]
                
            },
            {
                test: /\.css$/,
                use:['style-loader','css-loader']
            }   
        ]
    },
    output: {
        path: parentDir + '/dist',
        filename: 'ous.js'
      
    }
   
}
